---
name: solidity-gas-optimizer
description: Analyze and optimize gas consumption in Solidity smart contracts using proven patterns and best practices.
version: 1.0.0
author: binance
tags:
  - solidity
  - gas-optimization
  - smart-contracts
  - evm
---

# Solidity Gas Optimizer

Analyze and optimize gas consumption in Solidity smart contracts using proven patterns and best practices.

## When to Use This Skill

Use this skill when the user:

- Wants to reduce gas costs of their smart contract deployments or function calls
- Asks about gas-efficient coding patterns in Solidity
- Needs to compare gas usage between different implementation approaches
- Is preparing a contract for mainnet deployment and wants to minimize transaction costs

## Optimization Categories

### 1. Storage Optimization

- **Variable packing**: Pack multiple variables into a single 256-bit storage slot
- **Use `bytes32` over `string`** when possible for fixed-length data
- **Avoid redundant storage reads**: Cache storage variables in memory within functions
- **Use mappings over arrays** for lookups to avoid iteration

### 2. Function-Level Optimization

- **Use `calldata` instead of `memory`** for read-only function parameters
- **Short-circuit evaluation**: Place cheaper conditions first in `require` chains
- **Batch operations**: Combine multiple state changes into single transactions
- **Use `unchecked` blocks** for arithmetic that cannot overflow (Solidity 0.8+)

### 3. Deployment Optimization

- **Use `immutable` and `constant`** for values set once at deploy time
- **Minimize contract size**: Remove unused code, use libraries for shared logic
- **Use proxy patterns** for upgradeable contracts with shared logic

### 4. Loop Optimization

- **Cache array length** outside the loop: `uint256 len = arr.length`
- **Use `++i` instead of `i++`** to save ~5 gas per iteration
- **Avoid unbounded loops**: Always have a known upper bound

## Example Usage

```solidity
// Before: ~45,000 gas
function sum(uint256[] memory values) public pure returns (uint256 total) {
    for (uint256 i = 0; i < values.length; i++) {
        total += values[i];
    }
}

// After: ~38,000 gas
function sum(uint256[] calldata values) public pure returns (uint256 total) {
    uint256 len = values.length;
    for (uint256 i; i < len; ) {
        unchecked {
            total += values[i];
            ++i;
        }
    }
}
```

## Tools & References

- [Remix IDE](https://remix.ethereum.org/) - Gas estimation during development
- [Foundry Gas Reports](https://book.getfoundry.sh/) - Automated gas snapshots
- [EVM Codes](https://www.evm.codes/) - Opcode gas cost reference
