---
name: defi-yield-analyzer
description: Evaluate DeFi yield farming opportunities by analyzing APY sustainability, protocol risks, and impermanent loss scenarios.
version: 1.0.0
author: binance
tags:
  - defi
  - yield-farming
  - risk-analysis
  - liquidity
---

# DeFi Yield Analyzer

Evaluate DeFi yield farming opportunities by analyzing APY sustainability, protocol risks, and impermanent loss scenarios.

## When to Use This Skill

Use this skill when the user:

- Asks about yield farming strategies across DeFi protocols
- Wants to compare APY/APR between different pools or vaults
- Needs to understand impermanent loss risks for a specific liquidity pair
- Is evaluating whether a high-APY opportunity is sustainable or a potential rug-pull

## Analysis Framework

### 1. Yield Source Identification

Determine where the yield originates:

| Yield Source | Sustainability | Risk Level |
|-------------|---------------|------------|
| Trading fees | High | Low |
| Token emissions | Medium | Medium |
| Leveraged lending | Medium | High |
| Ponzinomics / unsourced | None | Critical |

### 2. Impermanent Loss Calculator

For AMM liquidity provision, estimate IL based on price movement:

- **±25% price change** → ~0.6% IL
- **±50% price change** → ~2.0% IL
- **±100% price change** → ~5.7% IL
- **±200% price change** → ~13.4% IL

Compare estimated IL against projected fee income to determine net profitability.

### 3. Protocol Risk Assessment

- **Smart contract audit status**: Audited by reputable firms?
- **TVL trend**: Growing or declining? Sudden drops are red flags.
- **Team & governance**: Doxxed team? Active governance participation?
- **Time in production**: Protocols < 6 months old carry higher risk.
- **Insurance availability**: Is coverage available via Nexus Mutual, InsurAce, etc.?

### 4. Strategy Recommendations

**Conservative** (low risk, 5-15% APY):
- Blue-chip stablecoin lending (Aave, Compound)
- Major pair LP with established DEXs

**Moderate** (medium risk, 15-50% APY):
- Concentrated liquidity on Uniswap V3
- Auto-compounding vaults (Yearn, Beefy)

**Aggressive** (high risk, 50%+ APY):
- New protocol farming with emission tokens
- Leveraged yield strategies

## Data Sources

- [DefiLlama](https://defillama.com/) - TVL & yield aggregation
- [DeFi Safety](https://defisafety.com/) - Protocol safety scores
- [Dune Analytics](https://dune.com/) - On-chain data dashboards
