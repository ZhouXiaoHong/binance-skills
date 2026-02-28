# Contributing to Binance Skills

## Adding a New Skill

1. Fork this repository
2. Create a skill directory under `skills/`
3. Add a `SKILL.md` file with required frontmatter
4. Submit a Pull Request

## Skill Directory Structure

Each skill is a directory containing at minimum a `SKILL.md` file:

```
skills/my-skill/
├── SKILL.md              # Required entry file
├── additional-docs.md    # Optional supporting files
├── scripts/              # Optional scripts
└── templates/            # Optional templates
```

## SKILL.md Format

```markdown
---
name: my-skill
description: A brief description of what this skill does
version: 1.0.0
author: your-github-username
tags:
  - category1
  - category2
---

# My Skill

Detailed instructions for the AI agent...
```

### Required Frontmatter Fields

- `name`: Unique identifier (lowercase + hyphens, must match directory name)
- `description`: One-line description

### Optional Frontmatter Fields

- `version`: Semver version (default: 1.0.0)
- `author`: GitHub username
- `tags`: Array of classification tags

## Guidelines

- Skill names must be unique across the entire registry
- Keep SKILL.md focused and actionable for AI agents
- Test your skill with at least one agent before submitting
