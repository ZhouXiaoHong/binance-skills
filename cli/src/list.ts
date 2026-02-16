import * as p from "@clack/prompts";
import pc from "picocolors";
import { getAgentConfig } from "./agents.ts";
import { listInstalledSkills } from "./installer.ts";
import { listComponents } from "./registry.ts";
import type { AgentType, InstallOptions, RegistryComponent } from "./types.ts";

interface ListOptions {
  global: boolean;
  provider?: string;
  tag?: string;
  remote?: boolean;
}

export function parseListOptions(args: string[]): ListOptions {
  const options: ListOptions = { global: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--global" || arg === "-g") {
      options.global = true;
    } else if (arg === "--provider") {
      options.provider = args[i + 1];
      i++;
    } else if (arg === "--tag") {
      options.tag = args[i + 1];
      i++;
    } else if (arg === "--remote" || arg === "-r") {
      options.remote = true;
    }
  }

  return options;
}

export async function runList(args: string[]): Promise<void> {
  const options = parseListOptions(args);

  if (options.remote) {
    await listRemoteSkills(options);
    return;
  }

  await listLocalSkills(options);
}

async function listRemoteSkills(options: ListOptions): Promise<void> {
  p.intro(pc.bgYellow(pc.black(" Available Skills ")));

  const spinner = p.spinner();
  spinner.start("Fetching skill registry...");

  let components: RegistryComponent[];
  try {
    components = await listComponents();
  } catch (err) {
    spinner.stop("Failed to fetch registry");
    p.log.error(
      `Could not fetch the skill registry: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }

  // Apply filters
  if (options.provider) {
    components = components.filter((c) => c.provider === options.provider);
  }
  if (options.tag) {
    const tag = options.tag.toLowerCase();
    components = components.filter((c) =>
      c.tags.some((t) => t.toLowerCase() === tag),
    );
  }

  spinner.stop(`Found ${components.length} skill(s)`);

  if (components.length === 0) {
    p.log.info("No skills found matching the criteria.");
    return;
  }

  // Sort by downloads (descending)
  components.sort((a, b) => b.downloads - a.downloads);

  for (const comp of components) {
    const providerBadge =
      comp.provider === "official"
        ? pc.yellow("[Official]")
        : pc.dim("[Community]");

    console.log(
      `  ${pc.bold(comp.name)} ${providerBadge} ${pc.dim(`(${comp.downloads} downloads)`)}`,
    );
    console.log(`    ${comp.description}`);
    console.log(
      `    ${pc.dim(`Tags: ${comp.tags.join(", ")}  |  Files: ${comp.files.length}  |  v${comp.version}`)}`,
    );
    console.log();
  }

  p.outro(
    `${components.length} skill(s) available. Use ${pc.bold("bnskills add <name>")} to install.`,
  );
}

async function listLocalSkills(options: ListOptions): Promise<void> {
  const installOpts: InstallOptions = {
    global: options.global,
  };

  p.intro(
    pc.bgYellow(
      pc.black(` Installed Skills (${options.global ? "global" : "project"}) `),
    ),
  );

  const skills = await listInstalledSkills(installOpts);

  if (skills.length === 0) {
    p.log.info(
      options.global
        ? "No skills installed globally."
        : "No skills installed in the current project.",
    );
    p.log.info(`Use ${pc.bold("bnskills add <name>")} to install a skill.`);
    p.log.info(
      `Use ${pc.bold("bnskills list --remote")} to see available skills.`,
    );
    p.outro("");
    return;
  }

  for (const skill of skills) {
    const agentNames =
      skill.agents.length > 0
        ? skill.agents.map((a) => getAgentConfig(a).displayName).join(", ")
        : "canonical only";

    console.log(`  ${pc.bold(skill.name)}`);
    console.log(`    Path:   ${pc.dim(skill.path)}`);
    console.log(
      `    Agents: ${agentNames}${skill.isSymlink ? pc.dim(" (symlink)") : ""}`,
    );
    console.log();
  }

  p.outro(`${skills.length} skill(s) installed.`);
}
