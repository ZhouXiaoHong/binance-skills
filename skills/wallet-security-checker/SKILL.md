---
name: wallet-security-checker
description: Assess wallet security posture by analyzing transaction history, approval patterns, and potential risk indicators.
version: 1.0.0
author: binance
tags:
  - security
  - wallet
  - blockchain
  - risk-assessment
---

# Wallet Security Checker

Assess wallet security posture by analyzing transaction history, approval patterns, and potential risk indicators.

## When to Use This Skill

Use this skill when the user:

- Wants to audit the security of their crypto wallet
- Needs to check for risky token approvals or unlimited allowances
- Asks about suspicious transactions on their address
- Wants to review their wallet hygiene before interacting with a new DeFi protocol

## Security Checks

### 1. Token Approval Audit

- List all ERC-20 / ERC-721 approvals granted by the wallet
- Flag **unlimited approvals** (`type(uint256).max`)
- Identify approvals to **unverified or suspicious contracts**
- Recommend revoking unused or risky approvals via [Revoke.cash](https://revoke.cash/)

### 2. Transaction Pattern Analysis

- Detect **large outgoing transfers** that deviate from normal behavior
- Identify interactions with **known phishing contracts**
- Flag **approve-then-transfer** patterns common in scam drainers
- Check for **dust attacks** (tiny incoming token transfers from unknown sources)

### 3. Contract Interaction Review

- List all unique contracts the wallet has interacted with
- Cross-reference with known exploit databases
- Check contract verification status on block explorers
- Flag interactions with contracts deployed less than 30 days ago

### 4. Address Reputation

- Check address against known blacklists (OFAC, Chainalysis, etc.)
- Review associated ENS or on-chain identity
- Analyze funding sources for KYC compliance signals

## Recommended Actions

| Risk Level | Action |
|-----------|--------|
| Critical | Immediately transfer assets to a new wallet |
| High | Revoke risky approvals, stop interacting with flagged contracts |
| Medium | Monitor transactions, consider hardware wallet |
| Low | Schedule periodic security reviews |

## Tools & APIs

- [Etherscan](https://etherscan.io/) / [BscScan](https://bscscan.com/) - Transaction history
- [Revoke.cash](https://revoke.cash/) - Approval management
- [GoPlus Security API](https://gopluslabs.io/) - Token & address risk scoring
