---
name: cursor-rules-generator
description: Generate Cursor IDE rules and agent configurations from templates
version: 1.0.0
author: tooling-community
tags:
  - tooling
  - cursor
  - rules
  - agent
---

# Cursor Rules Generator

Generate Cursor IDE `.cursor/rules/` files and agent configurations from standardized templates.

## When to Use

When the user wants to:
- Create new Cursor rules for their project
- Generate agent-specific configurations
- Standardize rule formats across a team

## Templates

This skill includes Handlebars templates in the `templates/` directory:

- `templates/rule.hbs` - Standard rule file template
- `templates/agent.hbs` - Agent configuration template

## Usage

### Creating a New Rule

1. Determine the rule scope (file pattern, language, or global)
2. Fill in the template variables:
   - `rule_name`: Descriptive name for the rule
   - `description`: What the rule enforces
   - `file_pattern`: Glob pattern for matching files
   - `instructions`: Detailed instructions for the AI
3. Save to `.cursor/rules/<rule_name>.md`

### Creating Agent Config

1. Choose the target agent type
2. Fill in the agent template with skill references
3. Save to the appropriate agent config directory

## Best Practices

- Keep rules focused on a single concern
- Use file patterns to scope rules to relevant files
- Include examples of expected behavior
- Test rules with sample prompts before deploying
