---
name: smart-contract-audit
description: Audit Solidity smart contracts for common vulnerabilities
version: 1.0.0
author: binance
tags:
  - blockchain
  - solidity
  - security
---

# Smart Contract Audit

Audit Solidity smart contracts for common vulnerabilities and security issues.

## When to Use

When the user asks to review, audit, or analyze a Solidity smart contract for security vulnerabilities.

## Steps

1. **Reentrancy Check**: Look for external calls followed by state changes
2. **Access Control**: Verify `onlyOwner`, role-based access patterns
3. **Integer Overflow/Underflow**: Check arithmetic operations (pre-Solidity 0.8)
4. **Unchecked Return Values**: Ensure low-level calls check return values
5. **Front-running**: Identify transactions vulnerable to MEV
6. **Gas Optimization**: Suggest gas-efficient patterns

Refer to `checklist.md` for the complete audit checklist.
Use templates in `templates/` directory for generating audit reports.
