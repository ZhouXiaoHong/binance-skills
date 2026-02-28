# Aave V3 Yield Farming Strategy

## Overview

A conservative yield farming strategy using Aave V3 on Ethereum mainnet.

## Strategy: USDC Lending + AAVE Rewards

### Setup

1. Deposit USDC into Aave V3 lending pool
2. Enable as collateral (optional, for leveraged strategies)
3. Claim AAVE reward tokens periodically

### Expected Returns

| Component | APY (estimate) |
|-----------|---------------|
| USDC lending | 3-5% |
| AAVE rewards | 0.5-1% |
| **Total** | **3.5-6%** |

### Risk Factors

- **Smart Contract Risk**: Low (Aave is heavily audited)
- **Liquidation Risk**: None if not borrowing
- **Market Risk**: USDC depeg risk (historically minimal)
- **Protocol Risk**: Low (Aave has a safety module)

### Gas Cost Analysis

At 30 gwei gas price:
- Deposit: ~$15-25
- Withdraw: ~$15-25
- Claim rewards: ~$10-15

**Minimum investment for profitability**: ~$5,000 (to cover gas costs within 1 month)

### Step-by-Step

1. Go to [app.aave.com](https://app.aave.com)
2. Connect wallet
3. Select "Supply" for USDC
4. Approve and deposit
5. Monitor position via Aave dashboard
6. Claim rewards monthly
