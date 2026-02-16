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

// GitHub API URLs (for private repos)
export const GITHUB_API_BASE = `https://api.github.com/repos/${REGISTRY_OWNER}/${REGISTRY_REPO}`;
export const GITHUB_API_CONTENTS = `${GITHUB_API_BASE}/contents`;

// Override registry URL or local path via environment variable
// Set BNSKILLS_REGISTRY to a local file path or custom URL for testing
export const REGISTRY_OVERRIDE = process.env["BNSKILLS_REGISTRY"];

export const COPY_EXCLUDE_PATTERNS = [
  ".git",
  ".gitignore",
  "README.md",
  "readme.md",
  "metadata.json",
];

export const CLI_NAME = "bnskills";
export const CLI_VERSION = "1.0.0";
