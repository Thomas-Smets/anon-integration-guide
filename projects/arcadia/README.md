# Arcadia Finance - Hey Anon AUTOMATE Integration

[Hey Anon AUTOMATE](https://github.com/RealWagmi/anon-integration-guide) adapter for [Arcadia Finance](https://arcadia.finance) on Base.

Deploy and manage concentrated liquidity positions on Uniswap and Aerodrome with automated rebalancing, compounding, and yield optimization.

- **Website**: https://arcadia.finance
- **Docs**: https://docs.arcadia.finance
- **Supported chains**: Base (8453)

## Common Tasks

### 1. Account Management

- "Create a new @Arcadia margin account on Base"
- "Show all my @Arcadia accounts"
- "What is the health factor of my @Arcadia account?"
- "Show the positions and collateral in my @Arcadia account"

### 2. Deposits and Withdrawals

- "Deposit 1000 USDC into my @Arcadia account"
- "Withdraw 0.5 WETH from my @Arcadia account"
- "Approve USDC for my @Arcadia account"

### 3. Lending

- "Show available lending pools on @Arcadia"
- "What is the APY for the USDC lending pool?"
- "Borrow 500 USDC from the USDC pool against my account"
- "Repay 500 USDC to the lending pool"

### 4. Liquidity Positions

- "Show featured LP strategies on @Arcadia"
- "Open a WETH/USDC LP position with 1000 USDC"
- "Open a 2x leveraged WETH/AERO position with 0.5 WETH"
- "Close my LP position and receive everything in USDC"
- "Remove half the liquidity from my LP position"
- "Swap WETH to USDC inside my @Arcadia account"

### 5. Automations

- "Enable the rebalancer on my Slipstream LP position"
- "Enable the compounder to auto-compound my LP fees"
- "Set up yield claiming with CowSwap to sell AERO rewards for USDC"
- "Enable the Merkl operator to claim incentive rewards"
- "Stake my LP position for AERO rewards"
- "Claim staking rewards for my position"

### 6. Portfolio Overview

- "Show my account value history over the last 30 days"
- "What is the PnL on my @Arcadia account?"
- "Show the points leaderboard"
- "How many @Arcadia points do I have?"
- "What are the current prices of WETH and USDC?"

## Development

```bash
yarn install
yarn build          # tsup (CJS + ESM + DTS)
yarn test           # vitest (45 tests)
yarn format:check   # prettier
yarn tsc --noEmit   # type check
```

## Submission

Submitted as PR to [RealWagmi/anon-integration-guide](https://github.com/RealWagmi/anon-integration-guide) under `projects/arcadia/`.

## License

MIT
