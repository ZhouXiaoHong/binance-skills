---
name: token-launch-checklist
description: Comprehensive pre-launch checklist for token/coin deployment covering smart contract, tokenomics, compliance, and go-to-market readiness.
version: 1.0.0
author: binance
tags:
  - token
  - launch
  - compliance
  - tokenomics
---

# Token Launch Checklist

Comprehensive pre-launch checklist for token/coin deployment covering smart contract, tokenomics, compliance, and go-to-market readiness.

## When to Use This Skill

Use this skill when the user:

- Is preparing to launch a new ERC-20, BEP-20, or other standard token
- Wants to ensure nothing is missed before token deployment to mainnet
- Needs guidance on regulatory and compliance considerations
- Asks about tokenomics design best practices

## Pre-Launch Checklist

### Phase 1: Smart Contract Development

- [ ] Token standard selected (ERC-20, BEP-20, ERC-721, ERC-1155)
- [ ] Core functions implemented (mint, burn, transfer, pause)
- [ ] Access control configured (Ownable, AccessControl, multi-sig)
- [ ] Unit tests cover all branches (>95% coverage)
- [ ] Fuzz testing completed with Foundry/Echidna
- [ ] Gas optimization review done
- [ ] Contract size within deployment limits (24KB)

### Phase 2: Security

- [ ] Internal code review by at least 2 developers
- [ ] External audit by a reputable firm (CertiK, Trail of Bits, OpenZeppelin)
- [ ] All audit findings addressed or documented with mitigations
- [ ] Bug bounty program set up (Immunefi recommended)
- [ ] Emergency pause mechanism tested
- [ ] Upgrade mechanism tested (if applicable)

### Phase 3: Tokenomics

- [ ] Total supply defined and justified
- [ ] Distribution breakdown documented:
  - Team & advisors (vesting schedule)
  - Community & ecosystem
  - Treasury / reserve
  - Public sale allocation
  - Liquidity provision
- [ ] Vesting contracts deployed and verified
- [ ] Inflation/deflation mechanics documented
- [ ] Token utility clearly defined (governance, staking, fees, access)

### Phase 4: Compliance & Legal

- [ ] Legal opinion on token classification (utility vs. security)
- [ ] KYC/AML requirements assessed for target jurisdictions
- [ ] Terms of service and privacy policy published
- [ ] Restricted jurisdictions identified and geo-blocking configured
- [ ] Tax reporting obligations documented

### Phase 5: Deployment & Listing

- [ ] Deploy to testnet and verify on block explorer
- [ ] Deploy to mainnet with multi-sig wallet
- [ ] Verify source code on Etherscan / BscScan
- [ ] Add token logo and metadata to trust wallet assets / token lists
- [ ] Initial liquidity provided and locked (with time-lock proof)
- [ ] DEX listing configured (Uniswap, PancakeSwap)
- [ ] CEX listing applications submitted (if applicable)

### Phase 6: Go-to-Market

- [ ] Website live with token information
- [ ] Documentation / whitepaper published
- [ ] Social channels active (Twitter, Discord, Telegram)
- [ ] Community AMA scheduled
- [ ] Launch announcement prepared

## Common Pitfalls

1. **No vesting** — Team dumping tokens immediately destroys trust
2. **Insufficient liquidity** — High slippage drives away early traders
3. **Missing renouncement plan** — Unclear path to decentralization
4. **No audit** — Major exchanges require audits for listing
