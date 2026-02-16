import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AgentConfig, AgentType } from "./types.ts";

const home = homedir();

function globalDir(sub: string): string {
  return join(home, sub);
}

function detectByPath(...paths: string[]): () => Promise<boolean> {
  return async () => paths.some((p) => existsSync(p));
}

/**
 * Universal agents share `.agents/skills/` as canonical location.
 * Non-universal agents have their own skills directories and get symlinks.
 */
export const agents: Record<AgentType, AgentConfig> = {
  cursor: {
    name: "cursor",
    displayName: "Cursor",
    skillsDir: ".cursor/skills",
    globalSkillsDir: globalDir(".cursor/skills"),
    detectInstalled: detectByPath(
      "/Applications/Cursor.app",
      join(home, ".cursor"),
      join(home, "AppData/Local/Programs/cursor"),
    ),
  },
  "claude-code": {
    name: "claude-code",
    displayName: "Claude Code",
    skillsDir: ".claude/skills",
    globalSkillsDir: globalDir(".claude/skills"),
    detectInstalled: detectByPath(join(home, ".claude")),
  },
  windsurf: {
    name: "windsurf",
    displayName: "Windsurf",
    skillsDir: ".windsurf/skills",
    globalSkillsDir: globalDir(".windsurf/skills"),
    detectInstalled: detectByPath(
      "/Applications/Windsurf.app",
      join(home, ".windsurf"),
    ),
  },
  cline: {
    name: "cline",
    displayName: "Cline",
    skillsDir: ".cline/skills",
    globalSkillsDir: globalDir(".cline/skills"),
    detectInstalled: detectByPath(join(home, ".cline")),
  },
  roo: {
    name: "roo",
    displayName: "Roo Code",
    skillsDir: ".roo/skills",
    globalSkillsDir: globalDir(".roo/skills"),
    detectInstalled: detectByPath(join(home, ".roo")),
  },
  kilo: {
    name: "kilo",
    displayName: "Kilo Code",
    skillsDir: ".kilocode/skills",
    globalSkillsDir: globalDir(".kilocode/skills"),
    detectInstalled: detectByPath(join(home, ".kilocode")),
  },
  augment: {
    name: "augment",
    displayName: "Augment",
    skillsDir: ".augment/skills",
    globalSkillsDir: globalDir(".augment/skills"),
    detectInstalled: detectByPath(join(home, ".augment")),
  },
  continue: {
    name: "continue",
    displayName: "Continue",
    skillsDir: ".continue/skills",
    globalSkillsDir: globalDir(".continue/skills"),
    detectInstalled: detectByPath(join(home, ".continue")),
  },
  junie: {
    name: "junie",
    displayName: "Junie",
    skillsDir: ".junie/skills",
    globalSkillsDir: globalDir(".junie/skills"),
    detectInstalled: detectByPath(join(home, ".junie")),
  },
  aider: {
    name: "aider",
    displayName: "Aider",
    skillsDir: ".aider/skills",
    globalSkillsDir: globalDir(".aider/skills"),
    detectInstalled: detectByPath(join(home, ".aider")),
  },
  bonito: {
    name: "bonito",
    displayName: "Bonito",
    skillsDir: ".bonito/skills",
    globalSkillsDir: globalDir(".bonito/skills"),
    detectInstalled: detectByPath(join(home, ".bonito")),
  },
  "copilot-chat": {
    name: "copilot-chat",
    displayName: "Copilot Chat",
    skillsDir: ".github/skills",
    globalSkillsDir: globalDir(".github/skills"),
    detectInstalled: detectByPath(join(home, ".github")),
  },
  devin: {
    name: "devin",
    displayName: "Devin",
    skillsDir: ".devin/skills",
    globalSkillsDir: globalDir(".devin/skills"),
    detectInstalled: detectByPath(join(home, ".devin")),
  },
  dia: {
    name: "dia",
    displayName: "Dia",
    skillsDir: ".dia/skills",
    globalSkillsDir: globalDir(".dia/skills"),
    detectInstalled: detectByPath(join(home, ".dia")),
  },
  double: {
    name: "double",
    displayName: "Double",
    skillsDir: ".double/skills",
    globalSkillsDir: globalDir(".double/skills"),
    detectInstalled: detectByPath(join(home, ".double")),
  },
  "emacs-gptel": {
    name: "emacs-gptel",
    displayName: "Emacs gptel",
    skillsDir: ".emacs-gptel/skills",
    globalSkillsDir: globalDir(".emacs-gptel/skills"),
    detectInstalled: detectByPath(join(home, ".emacs.d"), join(home, ".emacs")),
  },
  goose: {
    name: "goose",
    displayName: "Goose",
    skillsDir: ".goose/skills",
    globalSkillsDir: globalDir(".goose/skills"),
    detectInstalled: detectByPath(join(home, ".goose")),
  },
  manus: {
    name: "manus",
    displayName: "Manus",
    skillsDir: ".manus/skills",
    globalSkillsDir: globalDir(".manus/skills"),
    detectInstalled: detectByPath(join(home, ".manus")),
  },
  "neovim-codecompanion": {
    name: "neovim-codecompanion",
    displayName: "Neovim CodeCompanion",
    skillsDir: ".neovim-codecompanion/skills",
    globalSkillsDir: globalDir(".neovim-codecompanion/skills"),
    detectInstalled: detectByPath(join(home, ".config/nvim")),
  },
  "otto-coder": {
    name: "otto-coder",
    displayName: "Otto Coder",
    skillsDir: ".otto-coder/skills",
    globalSkillsDir: globalDir(".otto-coder/skills"),
    detectInstalled: detectByPath(join(home, ".otto-coder")),
  },
  "pear-ai": {
    name: "pear-ai",
    displayName: "Pear AI",
    skillsDir: ".pear-ai/skills",
    globalSkillsDir: globalDir(".pear-ai/skills"),
    detectInstalled: detectByPath(join(home, ".pear-ai")),
  },
  sourcegraph: {
    name: "sourcegraph",
    displayName: "Sourcegraph",
    skillsDir: ".sourcegraph/skills",
    globalSkillsDir: globalDir(".sourcegraph/skills"),
    detectInstalled: detectByPath(join(home, ".sourcegraph")),
  },
  superflex: {
    name: "superflex",
    displayName: "Superflex",
    skillsDir: ".superflex/skills",
    globalSkillsDir: globalDir(".superflex/skills"),
    detectInstalled: detectByPath(join(home, ".superflex")),
  },
  trae: {
    name: "trae",
    displayName: "Trae",
    skillsDir: ".trae/skills",
    globalSkillsDir: globalDir(".trae/skills"),
    detectInstalled: detectByPath(
      "/Applications/Trae.app",
      join(home, ".trae"),
    ),
  },
  void: {
    name: "void",
    displayName: "Void",
    skillsDir: ".void/skills",
    globalSkillsDir: globalDir(".void/skills"),
    detectInstalled: detectByPath(join(home, ".void")),
  },
  witsy: {
    name: "witsy",
    displayName: "Witsy",
    skillsDir: ".witsy/skills",
    globalSkillsDir: globalDir(".witsy/skills"),
    detectInstalled: detectByPath(join(home, ".witsy")),
  },
  zed: {
    name: "zed",
    displayName: "Zed",
    skillsDir: ".zed/skills",
    globalSkillsDir: globalDir(".zed/skills"),
    detectInstalled: detectByPath(
      "/Applications/Zed.app",
      join(home, ".config/zed"),
    ),
  },
  zencoder: {
    name: "zencoder",
    displayName: "ZenCoder",
    skillsDir: ".zencoder/skills",
    globalSkillsDir: globalDir(".zencoder/skills"),
    detectInstalled: detectByPath(join(home, ".zencoder")),
  },
  // Universal agents (share .agents/skills/)
  amp: {
    name: "amp",
    displayName: "AMP",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".amp")),
    showInUniversalList: true,
  },
  codex: {
    name: "codex",
    displayName: "Codex",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".codex")),
    showInUniversalList: true,
  },
  "gemini-cli": {
    name: "gemini-cli",
    displayName: "Gemini CLI",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".gemini")),
    showInUniversalList: true,
  },
  "github-copilot": {
    name: "github-copilot",
    displayName: "GitHub Copilot",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".github-copilot")),
    showInUniversalList: true,
  },
  "kimi-cli": {
    name: "kimi-cli",
    displayName: "Kimi CLI",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".kimi")),
    showInUniversalList: true,
  },
  opencode: {
    name: "opencode",
    displayName: "OpenCode",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".opencode")),
    showInUniversalList: true,
  },
  replit: {
    name: "replit",
    displayName: "Replit",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: detectByPath(join(home, ".replit")),
    showInUniversalList: true,
  },
  "unified-agent": {
    name: "unified-agent",
    displayName: "Universal (.agents/)",
    skillsDir: ".agents/skills",
    globalSkillsDir: globalDir(".agents/skills"),
    detectInstalled: async () => true,
    showInUniversalList: true,
  },
};

const UNIVERSAL_AGENTS: Set<AgentType> = new Set([
  "amp",
  "codex",
  "gemini-cli",
  "github-copilot",
  "kimi-cli",
  "opencode",
  "replit",
  "unified-agent",
]);

export function isUniversalAgent(type: AgentType): boolean {
  return UNIVERSAL_AGENTS.has(type);
}

export function getUniversalAgents(): AgentType[] {
  return [...UNIVERSAL_AGENTS];
}

export function getNonUniversalAgents(): AgentType[] {
  return (Object.keys(agents) as AgentType[]).filter(
    (a) => !UNIVERSAL_AGENTS.has(a),
  );
}

export function getAgentConfig(type: AgentType): AgentConfig {
  return agents[type];
}

export async function detectInstalledAgents(): Promise<AgentType[]> {
  const results = await Promise.all(
    (Object.keys(agents) as AgentType[]).map(async (type) => {
      const config = agents[type];
      if (!config || config.showInUniversalList) return null;
      const installed = await config.detectInstalled();
      return installed ? type : null;
    }),
  );
  return results.filter((r): r is AgentType => r !== null);
}
