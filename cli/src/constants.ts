export const AGENTS_DIR = ".agents";
export const SKILLS_SUBDIR = "skills";
export const UNIVERSAL_SKILLS_DIR = ".agents/skills";
export const SKILL_LOCK_FILENAME = ".skill-lock.json";
export const SKILL_LOCK_VERSION = 3;

export const REGISTRY_OWNER = "ZhouXiaoHong";
export const REGISTRY_REPO = "binance-skills";
export const REGISTRY_BRANCH = "main";
export const REGISTRY_BASE_URL = `https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/${REGISTRY_BRANCH}`;
export const COMPONENTS_JSON_URL = `${REGISTRY_BASE_URL}/docs/components.json`;

export const COPY_EXCLUDE_PATTERNS = [
  ".git",
  ".gitignore",
  "README.md",
  "readme.md",
  "metadata.json",
];

export const CLI_NAME = "bnskills";
export const CLI_VERSION = "1.0.0";
