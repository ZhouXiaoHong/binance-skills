import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { REGISTRY_BASE_URL } from "./constants.ts";
import type { RegistryComponent } from "./types.ts";

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
    const url = `${REGISTRY_BASE_URL}/${component.path}/${file}`;
    const destPath = join(tempDir, file);

    try {
      // Ensure subdirectory exists
      await mkdir(dirname(destPath), { recursive: true });

      const response = await fetch(url);

      if (!response.ok) {
        errors.push(`Failed to download ${file}: ${response.status}`);
        continue;
      }

      const content = await response.text();
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
