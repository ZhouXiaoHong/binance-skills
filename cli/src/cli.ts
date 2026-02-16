import pc from "picocolors";
import { CLI_NAME, CLI_VERSION } from "./constants.ts";

function showBanner(): void {
  console.log();
  console.log(
    pc.yellow(`  ${CLI_NAME}`) + pc.dim(` v${CLI_VERSION}`),
  );
  console.log(pc.dim("  Binance Agent Skills CLI"));
  console.log();
}

function showHelp(): void {
  showBanner();
  console.log("  Usage:");
  console.log(`    ${CLI_NAME} <command> [options]`);
  console.log();
  console.log("  Commands:");
  console.log("    add <name>       Install a skill from the registry");
  console.log("    remove <name>    Remove an installed skill");
  console.log("    list             List installed skills");
  console.log("    list --remote    List all available skills in the registry");
  console.log("    find <query>     Search for skills");
  console.log();
  console.log("  Options:");
  console.log("    --global, -g     Install/remove globally");
  console.log("    --agent, -a      Specify target agent (e.g. --agent cursor)");
  console.log("    --yes, -y        Skip confirmation prompts");
  console.log("    --help, -h       Show this help message");
  console.log("    --version, -v    Show version number");
  console.log();
  console.log("  Examples:");
  console.log(`    ${CLI_NAME} add smart-contract-audit`);
  console.log(`    ${CLI_NAME} add grid-strategy --agent cursor --global`);
  console.log(`    ${CLI_NAME} list --remote --provider official`);
  console.log(`    ${CLI_NAME} find "solidity"`);
  console.log(`    ${CLI_NAME} remove yield-farming`);
  console.log();
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const commandArgs = args.slice(1);

  if (!command || command === "--help" || command === "-h") {
    showHelp();
    process.exit(0);
  }

  if (command === "--version" || command === "-v") {
    console.log(CLI_VERSION);
    process.exit(0);
  }

  switch (command) {
    case "add":
    case "install":
    case "a":
    case "i": {
      const { runAdd } = await import("./add.ts");
      await runAdd(commandArgs);
      break;
    }

    case "remove":
    case "rm":
    case "r": {
      const { runRemove } = await import("./remove.ts");
      await runRemove(commandArgs);
      break;
    }

    case "list":
    case "ls": {
      const { runList } = await import("./list.ts");
      await runList(commandArgs);
      break;
    }

    case "find":
    case "search":
    case "f":
    case "s": {
      const { runFind } = await import("./find.ts");
      await runFind(commandArgs);
      break;
    }

    default:
      console.error(pc.red(`Unknown command: ${command}`));
      console.log(`Run ${pc.bold(`${CLI_NAME} --help`)} for usage information.`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(pc.red("Fatal error:"), err);
  process.exit(1);
});
