import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { AGENTS_DIR, SKILL_LOCK_FILENAME, SKILL_LOCK_VERSION } from "./constants.ts";
import type { AgentType, SkillLock, SkillLockEntry } from "./types.ts";

function getSkillLockPath(): string {
  return join(homedir(), AGENTS_DIR, SKILL_LOCK_FILENAME);
}

function createEmptyLock(): SkillLock {
  return {
    version: SKILL_LOCK_VERSION,
    skills: {},
  };
}

export async function readSkillLock(): Promise<SkillLock> {
  const lockPath = getSkillLockPath();

  if (!existsSync(lockPath)) {
    return createEmptyLock();
  }

  try {
    const content = await readFile(lockPath, "utf-8");
    const data = JSON.parse(content) as SkillLock;

    if (data.version !== SKILL_LOCK_VERSION) {
      return createEmptyLock();
    }

    return data;
  } catch {
    return createEmptyLock();
  }
}

async function writeSkillLock(lock: SkillLock): Promise<void> {
  const lockPath = getSkillLockPath();
  const lockDir = dirname(lockPath);

  await mkdir(lockDir, { recursive: true });
  await writeFile(lockPath, JSON.stringify(lock, null, 2), "utf-8");
}

export async function addSkillToLock(
  name: string,
  entry: SkillLockEntry,
): Promise<void> {
  const lock = await readSkillLock();
  const existing = lock.skills[name];

  lock.skills[name] = {
    ...entry,
    installedAt: existing?.installedAt || entry.installedAt,
  };

  await writeSkillLock(lock);
}

export async function removeSkillFromLock(name: string): Promise<void> {
  const lock = await readSkillLock();
  delete lock.skills[name];
  await writeSkillLock(lock);
}

export async function getSkillFromLock(
  name: string,
): Promise<SkillLockEntry | undefined> {
  const lock = await readSkillLock();
  return lock.skills[name];
}

export async function getAllLockedSkills(): Promise<
  Record<string, SkillLockEntry>
> {
  const lock = await readSkillLock();
  return lock.skills;
}

export async function getLastSelectedAgents(): Promise<AgentType[]> {
  const lock = await readSkillLock();
  return lock.lastSelectedAgents || [];
}

export async function saveSelectedAgents(
  agents: AgentType[],
): Promise<void> {
  const lock = await readSkillLock();
  lock.lastSelectedAgents = agents;
  await writeSkillLock(lock);
}
