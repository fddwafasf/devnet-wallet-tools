# Devnet Wallet Tools

A small, read-only Solana Devnet balance checker. It accepts a public address, calls the public RPC, and prints lamports and SOL with all nine decimal places. No private keys or wallet connection are needed.

## Run

Requires Node.js 22 or newer. There are no external dependencies.

```sh
node balance.js <PUBLIC_WALLET_ADDRESS>
npm test
```

The RPC is fixed to `https://api.devnet.solana.com`. Devnet SOL is for testing. Public RPC rate limits and network errors are reported as errors; they are never silently treated as a zero balance.

[Solana getBalance documentation](https://solana.com/docs/rpc/http/getbalance).

