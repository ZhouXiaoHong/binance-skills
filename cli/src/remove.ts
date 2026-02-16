import * as p from "@clack/prompts";
import pc from "picocolors";
import { listInstalledSkills, removeSkill } from "./installer.ts";
import { removeSkillFromLock } from "./skill-lock.ts";
import type { InstallOptions } from "./types.ts";

interface RemoveOptions {
  global: boolean;
  yes?: boolean;
}

export function parseRemoveOptions(args: string[]): {
  skillNames: string[];
  options: RemoveOptions;
} {
  const skillNames: string[] = [];
  const options: RemoveOptions = { global: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--global" || arg === "-g") {
      options.global = true;
    } else if (arg === "--yes" || arg === "-y") {
      options.yes = true;
    } else if (arg && !arg.startsWith("-")) {
      skillNames.push(arg);
    }
  }

  return { skillNames, options };
}

export async function runRemove(args: string[]): Promise<void> {
  const { skillNames, options } = parseRemoveOptions(args);

  const installOpts: InstallOptions = {
    global: options.global,
  };

  p.intro(
    pc.bgYellow(
      pc.black(` Remove Skills (${options.global ? "global" : "project"}) `),
    ),
  );

  // If no skill names provided, show interactive selection
  let toRemove = skillNames;

  if (toRemove.length === 0) {
    const installed = await listInstalledSkills(installOpts);

    if (installed.length === 0) {
      p.log.info("No skills installed to remove.");
      p.outro("");
      return;
    }

    const selected = await p.multiselect({
      message: "Select skills to remove:",
      options: installed.map((s) => ({
        value: s.name,
        label: s.name,
        hint: s.path,
      })),
      required: true,
    });

    if (p.isCancel(selected)) {
      p.cancel("Removal cancelled.");
      process.exit(0);
    }

    toRemove = selected as string[];
  }

  // Confirm
  if (!options.yes) {
    const confirmed = await p.confirm({
      message: `Remove ${toRemove.length} skill(s): ${pc.bold(toRemove.join(", "))}?`,
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Removal cancelled.");
      process.exit(0);
    }
  }

  // Remove each skill
  let totalRemoved = 0;
  let totalErrors = 0;

  for (const name of toRemove) {
    const spinner = p.spinner();
    spinner.start(`Removing ${name}...`);

    const { removed, errors } = await removeSkill(name, installOpts);

    if (removed.length > 0) {
      spinner.stop(`${pc.green("\u2713")} Removed ${name} (${removed.length} location(s))`);
      totalRemoved++;

      // Remove from lock file
      if (options.global) {
        try {
          await removeSkillFromLock(name);
        } catch {
          // Non-critical
        }
      }
    } else if (errors.length > 0) {
      spinner.stop(`${pc.red("\u2717")} Failed to remove ${name}: ${errors.join(", ")}`);
      totalErrors++;
    } else {
      spinner.stop(`${pc.yellow("!")} ${name} was not found`);
    }
  }

  p.outro(
    totalRemoved > 0
      ? pc.green(`Removed ${totalRemoved} skill(s)${totalErrors > 0 ? ` (${totalErrors} error(s))` : ""}`)
      : pc.yellow("No skills were removed"),
  );
}
