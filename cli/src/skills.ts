import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import matter from "gray-matter";
import type { Skill } from "./types.ts";

export async function parseSkillMd(
  filePath: string,
): Promise<Skill | null> {
  try {
    const content = await readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);

    const name = data["name"] as string | undefined;
    const description = data["description"] as string | undefined;

    if (!name || !description) {
      return null;
    }

    return {
      name,
      description,
      path: filePath,
      rawContent: body,
      metadata: data as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

export function getSkillDisplayName(skill: Skill): string {
  return skill.name || basename(skill.path);
}

export async function parseSkillFromDirectory(
  dirPath: string,
): Promise<Skill | null> {
  const skillMdPath = join(dirPath, "SKILL.md");
  return parseSkillMd(skillMdPath);
}
