export type AgentType =
  | "amp"
  | "aider"
  | "augment"
  | "bonito"
  | "claude-code"
  | "cline"
  | "codex"
  | "continue"
  | "copilot-chat"
  | "cursor"
  | "devin"
  | "dia"
  | "double"
  | "emacs-gptel"
  | "gemini-cli"
  | "github-copilot"
  | "goose"
  | "junie"
  | "kilo"
  | "kimi-cli"
  | "manus"
  | "neovim-codecompanion"
  | "opencode"
  | "otto-coder"
  | "pear-ai"
  | "replit"
  | "roo"
  | "sourcegraph"
  | "superflex"
  | "trae"
  | "unified-agent"
  | "void"
  | "windsurf"
  | "witsy"
  | "zed"
  | "zencoder";

export interface AgentConfig {
  name: AgentType;
  displayName: string;
  skillsDir: string;
  globalSkillsDir: string;
  detectInstalled: () => Promise<boolean>;
  showInUniversalList?: boolean;
}

export interface Skill {
  name: string;
  description: string;
  path: string;
  rawContent?: string;
  metadata?: Record<string, unknown>;
}

export interface RegistryComponent {
  name: string;
  description: string;
  provider: "official" | "community";
  category: string;
  type: string;
  version: string;
  author: string;
  tags: string[];
  downloads: number;
  path: string;
  files: string[];
  updatedAt: string;
}

export interface InstallOptions {
  global: boolean;
  cwd?: string;
}

export interface InstallResult {
  success: boolean;
  path: string;
  canonicalPath?: string;
  mode: "symlink" | "copy";
  symlinkFailed?: boolean;
  error?: string;
}

export interface SkillLockEntry {
  source: string;
  sourceType: string;
  sourceUrl: string;
  skillPath?: string;
  version?: string;
  installedAt: string;
  updatedAt: string;
}

export interface SkillLock {
  version: number;
  skills: Record<string, SkillLockEntry>;
  lastSelectedAgents?: AgentType[];
}
