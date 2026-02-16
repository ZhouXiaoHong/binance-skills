import { COMPONENTS_JSON_URL } from "./constants.ts";
import type { RegistryComponent } from "./types.ts";

let cachedComponents: RegistryComponent[] | null = null;

/**
 * Fetch the components.json registry from GitHub.
 */
export async function fetchRegistry(): Promise<RegistryComponent[]> {
  if (cachedComponents) {
    return cachedComponents;
  }

  const response = await fetch(COMPONENTS_JSON_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch registry: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as RegistryComponent[];

  if (!Array.isArray(data)) {
    throw new Error("Invalid registry format: expected an array");
  }

  cachedComponents = data;
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
