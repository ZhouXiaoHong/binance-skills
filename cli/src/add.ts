import * as p from "@clack/prompts";
import pc from "picocolors";
import { detectInstalledAgents, getAgentConfig, isUniversalAgent } from "./agents.ts";
import { installSkillFromDir } from "./installer.ts";
import { findComponent } from "./registry.ts";
import { downloadSkillFiles, cleanupTempDir } from "./downloader.ts";
import { addSkillToLock } from "./skill-lock.ts";
import { REGISTRY_BASE_URL } from "./constants.ts";
import type { AgentType, InstallOptions, RegistryComponent } from "./types.ts";

interface AddOptions {
  global?: boolean;
  agent?: AgentType[];
  yes?: boolean;
}

export function parseAddOptions(args: string[]): {
  skillName: string | undefined;
  options: AddOptions;
} {
  let skillName: string | undefined;
  const options: AddOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--global" || arg === "-g") {
      options.global = true;
    } else if (arg === "--yes" || arg === "-y") {
      options.yes = true;
    } else if (arg === "--agent" || arg === "-a") {
      const next = args[i + 1];
      if (next) {
        if (!options.agent) options.agent = [];
        options.agent.push(next as AgentType);
        i++;
      }
    } else if (!arg?.startsWith("-")) {
      skillName = arg;
    }
  }

  return { skillName, options };
}

export async function runAdd(args: string[]): Promise<void> {
  const { skillName, options } = parseAddOptions(args);

  if (!skillName) {
    p.log.error("Please specify a skill name. Usage: bnskills add <skill-name>");
    process.exit(1);
  }

  p.intro(pc.bgYellow(pc.black(` Installing skill: ${skillName} `)));

  // Step 1: Look up in registry
  const spinner = p.spinner();
  spinner.start("Fetching skill registry...");

  let component: RegistryComponent | undefined;
  try {
    component = await findComponent(skillName);
  } catch (err) {
    spinner.stop("Failed to fetch registry");
    p.log.error(
      `Could not fetch the skill registry: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }

  if (!component) {
    spinner.stop("Skill not found");
    p.log.error(`Skill "${skillName}" not found in the registry.`);
    p.log.info("Use `bnskills find <query>` to search available skills.");
    process.exit(1);
  }

  spinner.stop(
    `Found: ${pc.bold(component.name)} - ${component.description} (${pc.dim(`${component.downloads} downloads`)})`,
  );

  // Show skill info
  p.log.info(
    [
      `  Provider: ${component.provider === "official" ? pc.yellow("Official") : pc.dim("Community")}`,
      `  Category: ${component.category}`,
      `  Version:  ${component.version}`,
      `  Files:    ${component.files.length} file(s)`,
      `  Tags:     ${component.tags.join(", ")}`,
    ].join("\n"),
  );

  // Step 2: Select target agents
  let targetAgents: AgentType[] = [];

  if (options.agent && options.agent.length > 0) {
    targetAgents = options.agent;
  } else {
    const detected = await detectInstalledAgents();

    if (detected.length === 0) {
      p.log.warn(
        "No supported agents detected. Installing to universal (.agents/skills/) only.",
      );
      targetAgents = ["unified-agent" as AgentType];
    } else if (detected.length === 1 && detected[0]) {
      const agentConfig = getAgentConfig(detected[0]);
      p.log.info(`Detected agent: ${pc.bold(agentConfig.displayName)}`);
      targetAgents = detected;
    } else {
      const selected = await p.multiselect({
        message: "Select target agents:",
        options: detected.map((a) => {
          const config = getAgentConfig(a);
          return {
            value: a,
            label: config.displayName,
          };
        }),
        required: true,
      });

      if (p.isCancel(selected)) {
        p.cancel("Installation cancelled.");
        process.exit(0);
      }

      targetAgents = selected as AgentType[];
    }
  }

  // Step 3: Determine install scope (global vs project)
  let installGlobal = options.global ?? false;

  if (!options.global && !options.yes) {
    const scope = await p.select({
      message: "Install scope:",
      options: [
        { value: "global", label: "Global (available everywhere)" },
        { value: "project", label: "Project (current directory only)" },
      ],
    });

    if (p.isCancel(scope)) {
      p.cancel("Installation cancelled.");
      process.exit(0);
    }

    installGlobal = scope === "global";
  }

  const installOpts: InstallOptions = {
    global: installGlobal,
  };

  // Step 4: Confirm
  if (!options.yes) {
    const agentNames = targetAgents
      .map((a) => getAgentConfig(a).displayName)
      .join(", ");

    const confirmed = await p.confirm({
      message: `Install ${pc.bold(component.name)} to ${agentNames} (${installGlobal ? "global" : "project"})?`,
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Installation cancelled.");
      process.exit(0);
    }
  }

  // Step 5: Download skill files
  spinner.start(`Downloading ${component.files.length} file(s)...`);

  let tempDir: string;
  try {
    tempDir = await downloadSkillFiles(component);
    spinner.stop(`Downloaded ${component.files.length} file(s)`);
  } catch (err) {
    spinner.stop("Download failed");
    p.log.error(
      `Failed to download skill files: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }

  // Step 6: Install to each target agent
  const results: Array<{
    agent: AgentType;
    success: boolean;
    path: string;
    mode: string;
  }> = [];

  for (const agentType of targetAgents) {
    spinner.start(`Installing to ${getAgentConfig(agentType).displayName}...`);

    const result = await installSkillFromDir(
      component.name,
      tempDir,
      agentType,
      installOpts,
    );

    if (result.success) {
      spinner.stop(
        `${pc.green("\u2713")} ${getAgentConfig(agentType).displayName}: ${pc.dim(result.path)} ${result.mode === "symlink" ? pc.dim("(symlink)") : ""}`,
      );
    } else {
      spinner.stop(
        `${pc.red("\u2717")} ${getAgentConfig(agentType).displayName}: ${result.error}`,
      );
    }

    results.push({
      agent: agentType,
      success: result.success,
      path: result.path,
      mode: result.mode,
    });
  }

  // Step 7: Cleanup temp directory
  await cleanupTempDir(tempDir);

  // Step 8: Update lock file (for global installs)
  if (installGlobal) {
    try {
      await addSkillToLock(component.name, {
        source: `${component.provider}/${component.category}/${component.name}`,
        sourceType: "registry",
        sourceUrl: `${REGISTRY_BASE_URL}/${component.path}`,
        version: component.version,
        installedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Non-critical: lock file update failure shouldn't fail the install
    }
  }

  // Step 9: Summary
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  p.outro(
    successful > 0
      ? pc.green(
          `Installed ${pc.bold(component.name)} to ${successful} agent(s)${failed > 0 ? ` (${failed} failed)` : ""}`,
        )
      : pc.red(`Failed to install ${component.name}`),
  );
}
