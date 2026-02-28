---
name: yield-farming
description: Analyze and compare DeFi yield farming strategies across protocols
version: 1.0.0
author: defi-community
tags:
  - defi
  - yield
  - farming
  - aave
  - compound
---

# Yield Farming Strategy Analysis

Analyze and compare DeFi yield farming opportunities across major protocols.

## When to Use

When the user asks about:
- Yield farming opportunities
- Comparing APY across DeFi protocols
- Risk assessment of farming strategies
- Impermanent loss calculations

## Configuration

Default protocol settings are in `config.json`. Modify thresholds as needed.

## Analysis Steps

1. **Protocol Research**: Identify target protocols and their current APY
2. **Risk Assessment**: Evaluate smart contract risk, protocol risk, market risk
3. **Impermanent Loss**: Calculate potential IL for liquidity provision
4. **Gas Costs**: Factor in transaction costs for deposits/withdrawals/claims
5. **Net Yield**: Calculate actual yield after all costs and risks
6. **Comparison**: Rank strategies by risk-adjusted returns

## Example Strategies

See `examples/aave-strategy.md` for a detailed Aave V3 farming strategy walkthrough.

## Risk Levels

| Level | Description | Example |
|-------|-------------|--------|
| Low | Blue-chip lending | Aave/Compound USDC lending |
| Medium | LP farming | Uniswap V3 ETH/USDC |
| High | Leveraged farming | Recursive lending loops |
| Very High | New protocols | Unaudited yield aggregators |
