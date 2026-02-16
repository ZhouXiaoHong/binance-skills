# Binance Skills

A centralized registry of AI agent skills for blockchain, trading, and security.

## Quick Start

```bash
# Install a skill
npx bnskills add smart-contract-audit

# List available skills
npx bnskills list

# Search skills
npx bnskills find "solidity"

# Remove a skill
npx bnskills remove smart-contract-audit
```

## Repository Structure

```
binance-skills/
├── official/          # Binance official skills
│   ├── blockchain/
│   ├── trading/
│   └── security/
├── community/         # Community contributed skills
│   ├── defi/
│   └── tooling/
├── cli/               # CLI tool (bnskills)
├── docs/              # Generated static data
│   └── components.json
└── scripts/           # Build & generation scripts
```

## Skill Format

Each skill is a directory with a required `SKILL.md` entry file and optional supporting files:

```
my-skill/
├── SKILL.md           # Entry file (required)
├── checklist.md       # Supporting docs (optional)
├── scripts/           # Scripts (optional)
└── templates/         # Templates (optional)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT
