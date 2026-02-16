import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import {
  COMPONENTS_JSON_URL,
  GITHUB_API_CONTENTS,
  REGISTRY_OVERRIDE,
} from "./constants.ts";
import type { RegistryComponent } from "./types.ts";

let cachedComponents: RegistryComponent[] | null = null;

function getGitHubToken(): string | undefined {
  return process.env["GITHUB_TOKEN"] || process.env["GH_TOKEN"];
}

/**
 * Fetch the components.json registry.
 * Priority:
 * 1. BNSKILLS_REGISTRY env var (local path or custom URL)
 * 2. Raw GitHub URL (works for public repos)
 * 3. GitHub API with token (for private repos)
 */
export async function fetchRegistry(): Promise<RegistryComponent[]> {
  if (cachedComponents) {
    return cachedComponents;
  }

  // Priority 1: Local file or custom URL override
  if (REGISTRY_OVERRIDE) {
    const data = await fetchFromOverride(REGISTRY_OVERRIDE);
    cachedComponents = data;
    return data;
  }

  const token = getGitHubToken();

  // Priority 2: Raw URL (fast, works for public repos)
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    const response = await fetch(COMPONENTS_JSON_URL, { headers });

    if (response.ok) {
      const data = (await response.json()) as RegistryComponent[];
      if (Array.isArray(data)) {
        cachedComponents = data;
        return data;
      }
    }
  } catch {
    // Fall through to GitHub API
  }

  // Priority 3: GitHub API (works for private repos with token)
  if (token) {
    try {
      const response = await fetch(
        `${GITHUB_API_CONTENTS}/docs/components.json`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3.raw",
          },
        },
      );

      if (response.ok) {
        const data = (await response.json()) as RegistryComponent[];
        if (Array.isArray(data)) {
          cachedComponents = data;
          return data;
        }
      }

      throw new Error(
        `GitHub API returned ${response.status}: ${response.statusText}`,
      );
    } catch (err) {
      throw new Error(
        `Failed to fetch registry via GitHub API: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  throw new Error(
    "Failed to fetch registry. For private repos, set GITHUB_TOKEN or GH_TOKEN environment variable.\n" +
      "For local testing, set BNSKILLS_REGISTRY to a local file path.",
  );
}

async function fetchFromOverride(
  override: string,
): Promise<RegistryComponent[]> {
  // If it's a file path
  if (existsSync(override) || override.startsWith("/") || override.startsWith(".")) {
    const content = await readFile(override, "utf-8");
    const data = JSON.parse(content) as RegistryComponent[];
    if (!Array.isArray(data)) {
      throw new Error("Invalid registry format: expected an array");
    }
    return data;
  }

  // If it's a URL
  const response = await fetch(override);
  if (!response.ok) {
    throw new Error(`Failed to fetch registry from ${override}: ${response.status}`);
  }
  const data = (await response.json()) as RegistryComponent[];
  if (!Array.isArray(data)) {
    throw new Error("Invalid registry format: expected an array");
  }
  return data;
}

/**
 * Find a skill by name in the registry.
 */
export async function findComponent(
  name: string,
): Promise<RegistryComponent | undefined> {
  const components = await fetchRegistry();
  return components.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
}

/**
 * Search components by query string (matches name, description, tags).
 */
export async function searchComponents(
  query: string,
): Promise<RegistryComponent[]> {
  const components = await fetchRegistry();
  const q = query.toLowerCase();

  return components.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

/**
 * Filter components by provider.
 */
export async function filterByProvider(
  provider: "official" | "community",
): Promise<RegistryComponent[]> {
  const components = await fetchRegistry();
  return components.filter((c) => c.provider === provider);
}

/**
 * Filter components by tag.
 */
export async function filterByTag(tag: string): Promise<RegistryComponent[]> {
  const components = await fetchRegistry();
  return components.filter((c) =>
    c.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

/**
 * Get all available components.
 */
export async function listComponents(): Promise<RegistryComponent[]> {
  return fetchRegistry();
}
