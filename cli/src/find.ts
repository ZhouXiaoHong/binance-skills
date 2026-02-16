import * as p from "@clack/prompts";
import pc from "picocolors";
import { searchComponents } from "./registry.ts";
import type { RegistryComponent } from "./types.ts";

export async function runFind(args: string[]): Promise<void> {
  let query = args.filter((a) => !a.startsWith("-")).join(" ");

  if (!query) {
    const input = await p.text({
      message: "Search skills:",
      placeholder: "Enter a search query...",
    });

    if (p.isCancel(input) || !input) {
      p.cancel("Search cancelled.");
      process.exit(0);
    }

    query = input;
  }

  p.intro(pc.bgYellow(pc.black(` Search: "${query}" `)));

  const spinner = p.spinner();
  spinner.start("Searching...");

  let results: RegistryComponent[];
  try {
    results = await searchComponents(query);
  } catch (err) {
    spinner.stop("Search failed");
    p.log.error(
      `Could not search the registry: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }

  spinner.stop(`Found ${results.length} result(s)`);

  if (results.length === 0) {
    p.log.info("No skills found matching your query.");
    p.outro("");
    return;
  }

  // Sort by downloads
  results.sort((a, b) => b.downloads - a.downloads);

  for (const comp of results) {
    const providerBadge =
      comp.provider === "official"
        ? pc.yellow("[Official]")
        : pc.dim("[Community]");

    console.log(
      `  ${pc.bold(comp.name)} ${providerBadge} ${pc.dim(`(${comp.downloads} downloads)`)}`,
    );
    console.log(`    ${comp.description}`);
    console.log(
      `    ${pc.dim(`Tags: ${comp.tags.join(", ")}  |  v${comp.version}`)}`,
    );
    console.log(
      `    ${pc.dim(`Install: npx bnskills add ${comp.name}`)}`,
    );
    console.log();
  }

  p.outro(`${results.length} skill(s) found.`);
}
