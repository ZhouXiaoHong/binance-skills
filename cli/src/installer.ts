import {
  copyFile,
  lstat,
  mkdir,
  readdir,
  readlink,
  realpath,
  rm,
  symlink,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { homedir, platform } from "node:os";
import {
  agents,
  getAgentConfig,
  getNonUniversalAgents,
  isUniversalAgent,
} from "./agents.ts";
import { AGENTS_DIR, COPY_EXCLUDE_PATTERNS, SKILLS_SUBDIR } from "./constants.ts";
import type { AgentType, InstallOptions, InstallResult } from "./types.ts";

/**
 * Sanitize skill name: lowercase, hyphens, no path traversal.
 */
export function sanitizeName(name: string): string {
  let sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (sanitized.length > 255) {
    sanitized = sanitized.slice(0, 255);
  }

  if (!sanitized || sanitized === "." || sanitized === "..") {
    throw new Error(`Invalid skill name: ${name}`);
  }

  return sanitized;
}

/**
 * Check if a path is safe (no path traversal).
 */
export function isPathSafe(basePath: string, targetPath: string): boolean {
  const resolvedBase = resolve(basePath);
  const resolvedTarget = resolve(targetPath);
  return resolvedTarget.startsWith(resolvedBase);
}

/**
 * Get the canonical skills directory (.agents/skills).
 */
export function getCanonicalSkillsDir(opts: InstallOptions): string {
  if (opts.global) {
    return join(homedir(), AGENTS_DIR, SKILLS_SUBDIR);
  }
  return join(opts.cwd || process.cwd(), AGENTS_DIR, SKILLS_SUBDIR);
}

/**
 * Get the canonical path for a skill.
 */
export function getCanonicalPath(
  skillName: string,
  opts: InstallOptions,
): string {
  const name = sanitizeName(skillName);
  return join(getCanonicalSkillsDir(opts), name);
}

/**
 * Get the install path for a skill in a specific agent's directory.
 */
export function getInstallPath(
  skillName: string,
  agentType: AgentType,
  opts: InstallOptions,
): string {
  const name = sanitizeName(skillName);
  const config = getAgentConfig(agentType);

  if (opts.global) {
    return join(config.globalSkillsDir, name);
  }
  return join(opts.cwd || process.cwd(), config.skillsDir, name);
}

/**
 * Clean and create a directory.
 */
async function cleanAndCreateDirectory(dirPath: string): Promise<void> {
  if (existsSync(dirPath)) {
    await rm(dirPath, { recursive: true, force: true });
  }
  await mkdir(dirPath, { recursive: true });
}

/**
 * Copy a directory recursively, excluding certain patterns.
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (COPY_EXCLUDE_PATTERNS.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

/**
 * Create a symlink, with fallback handling.
 */
async function createSymlink(
  target: string,
  linkPath: string,
): Promise<boolean> {
  try {
    const linkDir = dirname(linkPath);
    await mkdir(linkDir, { recursive: true });

    // Remove existing symlink or directory
    if (existsSync(linkPath)) {
      const stat = await lstat(linkPath);
      if (stat.isSymbolicLink()) {
        await rm(linkPath);
      } else {
        await rm(linkPath, { recursive: true, force: true });
      }
    }

    // Use junction on Windows, regular symlink elsewhere
    const type = platform() === "win32" ? "junction" : "dir";

    // Compute relative path for symlink
    const relativeTarget = relative(linkDir, target);
    await symlink(relativeTarget, linkPath, type);
    return true;
  } catch {
    return false;
  }
}

/**
 * Install a skill from a local directory to a specific agent.
 * 1. Copy to canonical location (.agents/skills/<name>)
 * 2. For non-universal agents, create symlink from agent dir to canonical
 */
export async function installSkillFromDir(
  skillName: string,
  sourceDir: string,
  agentType: AgentType,
  opts: InstallOptions,
): Promise<InstallResult> {
  const name = sanitizeName(skillName);
  const canonicalPath = getCanonicalPath(name, opts);
  const installPath = getInstallPath(name, agentType, opts);

  try {
    // Step 1: Copy to canonical
    await cleanAndCreateDirectory(canonicalPath);
    await copyDirectory(sourceDir, canonicalPath);

    // Step 2: For non-universal agents, create symlink
    if (!isUniversalAgent(agentType) && canonicalPath !== installPath) {
      const symlinkCreated = await createSymlink(canonicalPath, installPath);

      if (!symlinkCreated) {
        // Fallback: copy instead of symlink
        await cleanAndCreateDirectory(installPath);
        await copyDirectory(canonicalPath, installPath);
        return {
          success: true,
          path: installPath,
          canonicalPath,
          mode: "copy",
          symlinkFailed: true,
        };
      }

      return {
        success: true,
        path: installPath,
        canonicalPath,
        mode: "symlink",
      };
    }

    // Universal agent: canonical is the install path
    return {
      success: true,
      path: canonicalPath,
      canonicalPath,
      mode: "copy",
    };
  } catch (err) {
    return {
      success: false,
      path: installPath,
      canonicalPath,
      mode: "copy",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Check if a skill is installed for a given agent.
 */
export function isSkillInstalled(
  skillName: string,
  agentType: AgentType,
  opts: InstallOptions,
): boolean {
  const installPath = getInstallPath(skillName, agentType, opts);
  return existsSync(installPath);
}

/**
 * List all installed skills by scanning agent directories.
 */
export async function listInstalledSkills(
  opts: InstallOptions,
): Promise<
  Array<{
    name: string;
    path: string;
    agents: AgentType[];
    isSymlink: boolean;
  }>
> {
  const skills = new Map<
    string,
    { name: string; path: string; agents: AgentType[]; isSymlink: boolean }
  >();

  // Scan canonical directory
  const canonicalDir = getCanonicalSkillsDir(opts);
  if (existsSync(canonicalDir)) {
    try {
      const entries = await readdir(canonicalDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() || entry.isSymbolicLink()) {
          const skillPath = join(canonicalDir, entry.name);
          skills.set(entry.name, {
            name: entry.name,
            path: skillPath,
            agents: [],
            isSymlink: false,
          });
        }
      }
    } catch {
      // Directory not readable
    }
  }

  // Scan each non-universal agent's directory
  for (const agentType of getNonUniversalAgents()) {
    const config = getAgentConfig(agentType);
    const agentSkillsDir = opts.global
      ? config.globalSkillsDir
      : join(opts.cwd || process.cwd(), config.skillsDir);

    if (!existsSync(agentSkillsDir)) continue;

    try {
      const entries = await readdir(agentSkillsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() || entry.isSymbolicLink()) {
          const existing = skills.get(entry.name);
          if (existing) {
            existing.agents.push(agentType);
            if (entry.isSymbolicLink()) {
              existing.isSymlink = true;
            }
          } else {
            skills.set(entry.name, {
              name: entry.name,
              path: join(agentSkillsDir, entry.name),
              agents: [agentType],
              isSymlink: entry.isSymbolicLink(),
            });
          }
        }
      }
    } catch {
      // Directory not readable
    }
  }

  return [...skills.values()];
}

/**
 * Remove a skill from all agent directories and canonical.
 */
export async function removeSkill(
  skillName: string,
  opts: InstallOptions,
): Promise<{ removed: string[]; errors: string[] }> {
  const name = sanitizeName(skillName);
  const removed: string[] = [];
  const errors: string[] = [];

  // Remove from non-universal agent directories
  for (const agentType of getNonUniversalAgents()) {
    const installPath = getInstallPath(name, agentType, opts);
    if (existsSync(installPath)) {
      try {
        const stat = await lstat(installPath);
        if (stat.isSymbolicLink()) {
          await rm(installPath);
        } else {
          await rm(installPath, { recursive: true, force: true });
        }
        removed.push(`${agentType}: ${installPath}`);
      } catch (err) {
        errors.push(
          `Failed to remove from ${agentType}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }

  // Remove canonical
  const canonicalPath = getCanonicalPath(name, opts);
  if (existsSync(canonicalPath)) {
    try {
      await rm(canonicalPath, { recursive: true, force: true });
      removed.push(`canonical: ${canonicalPath}`);
    } catch (err) {
      errors.push(
        `Failed to remove canonical: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return { removed, errors };
}
