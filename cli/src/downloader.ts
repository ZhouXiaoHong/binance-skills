import { copyFile as fsCopyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { GITHUB_API_CONTENTS, REGISTRY_BASE_URL } from "./constants.ts";
import type { RegistryComponent } from "./types.ts";

function getGitHubToken(): string | undefined {
  return process.env["GITHUB_TOKEN"] || process.env["GH_TOKEN"];
}

function getLocalRepoPath(): string | undefined {
  return process.env["BNSKILLS_REPO_PATH"];
}

/**
 * Download a single file from the registry.
 * Priority:
 * 1. Local repo path (BNSKILLS_REPO_PATH)
 * 2. Raw GitHub URL
 * 3. GitHub API (for private repos)
 */
async function downloadFile(repoPath: string): Promise<string> {
  // Priority 1: Local repo path
  const localRepo = getLocalRepoPath();
  if (localRepo) {
    const localFile = join(localRepo, repoPath);
    if (existsSync(localFile)) {
      return await readFile(localFile, "utf-8");
    }
  }

  const token = getGitHubToken();

  // Priority 2: Raw URL
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    const url = `${REGISTRY_BASE_URL}/${repoPath}`;
    const response = await fetch(url, { headers });

    if (response.ok) {
      return await response.text();
    }
  } catch {
    // Fall through
  }

  // Priority 3: GitHub API
  if (token) {
    const response = await fetch(`${GITHUB_API_CONTENTS}/${repoPath}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (response.ok) {
      return await response.text();
    }

    throw new Error(`GitHub API returned ${response.status} for ${repoPath}`);
  }

  throw new Error(
    `Failed to download ${repoPath}. Set BNSKILLS_REPO_PATH for local testing, or GITHUB_TOKEN for private repos.`,
  );
}

/**
 * Download all files for a skill component into a temporary directory.
 * Returns the path to the temp directory containing the skill files.
 */
export async function downloadSkillFiles(
  component: RegistryComponent,
): Promise<string> {
  const tempDir = join(
    tmpdir(),
    `bnskills-${component.name}-${Date.now()}`,
  );
  await mkdir(tempDir, { recursive: true });

  const errors: string[] = [];

  for (const file of component.files) {
    const repoPath = `${component.path}/${file}`;
    const destPath = join(tempDir, file);

    try {
      await mkdir(dirname(destPath), { recursive: true });
      const content = await downloadFile(repoPath);
      await writeFile(destPath, content, "utf-8");
    } catch (err) {
      errors.push(
        `Error downloading ${file}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  if (errors.length > 0 && errors.length === component.files.length) {
    throw new Error(
      `Failed to download any files for ${component.name}:\n${errors.join("\n")}`,
    );
  }

  if (errors.length > 0) {
    console.warn(
      `Warning: Some files failed to download:\n${errors.join("\n")}`,
    );
  }

  return tempDir;
}

/**
 * Clean up a temporary download directory.
 */
export async function cleanupTempDir(tempDir: string): Promise<void> {
  const { rm } = await import("node:fs/promises");
  await rm(tempDir, { recursive: true, force: true });
}
