# Smart Contract Audit Checklist

## Critical Severity

- [ ] Reentrancy vulnerabilities (cross-function, cross-contract)
- [ ] Unauthorized access to privileged functions
- [ ] Integer overflow/underflow (pre-0.8.0)
- [ ] Unprotected selfdestruct
- [ ] Delegatecall to untrusted contracts

## High Severity

- [ ] Unchecked external call return values
- [ ] Front-running / MEV vulnerabilities
- [ ] Oracle manipulation
- [ ] Flash loan attack vectors
- [ ] Signature replay attacks

## Medium Severity

- [ ] Centralization risks
- [ ] Missing event emissions
- [ ] Incorrect inheritance order
- [ ] Block timestamp dependence
- [ ] DoS with block gas limit

## Low Severity

- [ ] Floating pragma
- [ ] Missing zero-address checks
- [ ] Unused variables or imports
- [ ] Non-standard naming conventions
- [ ] Missing NatSpec documentation

## Gas Optimization

- [ ] Use `calldata` instead of `memory` for read-only args
- [ ] Cache storage variables in local variables
- [ ] Use `unchecked` blocks where overflow is impossible
- [ ] Pack struct variables to minimize storage slots
- [ ] Use `immutable` and `constant` where applicable
