---
name: web3-dapp-scaffold
description: Scaffold a production-ready Web3 DApp frontend with wallet connection, contract interaction, and multi-chain support.
version: 1.0.0
author: binance
tags:
  - web3
  - frontend
  - dapp
  - react
  - wagmi
---

# Web3 DApp Scaffold

Scaffold a production-ready Web3 DApp frontend with wallet connection, contract interaction, and multi-chain support.

## When to Use This Skill

Use this skill when the user:

- Wants to create a new Web3 DApp frontend from scratch
- Needs wallet connection (MetaMask, WalletConnect, Coinbase Wallet)
- Asks about integrating smart contract interactions into a React app
- Wants multi-chain support (Ethereum, BSC, Polygon, Arbitrum, etc.)

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|----------|
| Framework | Next.js 14+ | SSR, routing, API routes |
| Web3 Library | wagmi v2 + viem | Contract interaction, hooks |
| Wallet Connection | ConnectKit / RainbowKit | Wallet modal UI |
| Styling | Tailwind CSS | Utility-first CSS |
| State Management | TanStack Query | Server state caching |
| Type Safety | TypeScript | End-to-end type safety |

## Project Structure

```
my-dapp/
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/
│   │   ├── ConnectButton.tsx # Wallet connection button
│   │   ├── NetworkSwitch.tsx # Chain switcher
│   │   └── TxButton.tsx      # Transaction submit button with status
│   ├── hooks/
│   │   ├── useContract.ts    # Contract read/write hooks
│   │   └── useTokenBalance.ts
│   ├── lib/
│   │   ├── chains.ts         # Chain configurations
│   │   ├── contracts.ts      # Contract ABIs & addresses
│   │   └── wagmi.ts          # Wagmi client config
│   └── providers/
│       └── Web3Provider.tsx  # Wagmi + QueryClient provider
├── public/
├── package.json
└── tsconfig.json
```

## Quick Start

### 1. Initialize Project

```bash
npx create-next-app@latest my-dapp --typescript --tailwind --app
cd my-dapp
npm install wagmi viem @tanstack/react-query connectkit
```

### 2. Configure Wagmi Client

```typescript
import { createConfig, http } from 'wagmi'
import { mainnet, bsc, polygon } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    chains: [mainnet, bsc, polygon],
    transports: {
      [mainnet.id]: http(),
      [bsc.id]: http(),
      [polygon.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    appName: 'My DApp',
  })
)
```

### 3. Read Contract Data

```typescript
import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

function TokenBalance({ address, token }) {
  const { data: balance } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })
  return <span>{balance?.toString()}</span>
}
```

## Supported Chains

- Ethereum Mainnet & Sepolia
- BNB Smart Chain & Testnet
- Polygon & Mumbai
- Arbitrum One & Goerli
- Optimism & Goerli
- Base

## Best Practices

- Always handle wallet disconnection gracefully
- Show transaction status feedback (pending, confirming, confirmed)
- Use `useWaitForTransactionReceipt` to wait for on-chain confirmation
- Implement proper error boundaries for Web3 errors
- Cache contract reads with appropriate stale times
