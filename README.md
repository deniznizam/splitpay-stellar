# SplitPay — Stellar Testnet Bill Splitter

SplitPay is a responsive web dApp for the **Stellar White Belt** challenge. It puts **bill splitting front and center**: enter a total, choose how many people are sharing, pick how many shares you pay for, and send your calculated XLM portion on **Stellar testnet** via **Freighter**.

## Live Demo

`[Add your Vercel URL after deploy]`

## Features

- **Freighter wallet integration** — connect / disconnect with `@stellar/freighter-api`
- **Live XLM balance** — fetched from Horizon (`GET /accounts/{publicKey}`)
- **Split-first UX** — total bill, group size, and “you pay for N people” with instant share calculation
- **Copy split summary** — one-click clipboard message with per-person share + app link (shareable viral loop)
- **On-chain memo (Text)** — user description embedded via `Memo.text()` in `TransactionBuilder`, visible on Stellar Expert
- **EN / TR UI toggle** — English default for global jury; Turkish for local demos
- **Testnet payments** — `TransactionBuilder` + Freighter signing + Horizon submission
- **Transaction feedback** — loading state, success/error, transaction hash, Stellar Expert link
- **Friendbot shortcut** — one-click testnet funding when balance is empty

## Stellar Standards Highlight

Payments attach an optional **Memo (Text)** field (max 28 characters) using the Stellar SDK. This follows Stellar’s on-ledger metadata pattern — no off-chain database required for payment context. Reviewers can verify memos on [Stellar Expert (testnet)](https://stellar.expert/explorer/testnet).

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- `@stellar/stellar-sdk`
- `@stellar/freighter-api`

## Local Setup

### Prerequisites

1. [Freighter](https://www.freighter.app/) browser extension
2. Freighter set to **Testnet** (Settings → Network → Testnet)
3. Node.js 18+

### Run locally

```bash
git clone <your-github-repo-url>
cd splitpay-stellar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: production URL for copy summary

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_APP_URL=https://your-splitpay.vercel.app
```

If unset, the copy button uses the current browser origin.

### Get testnet XLM

1. Connect your wallet in the app
2. Click **Get test XLM**, or use [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

### Try a split payment

1. Enter total bill (e.g. `100` XLM) and people count (e.g. `4`)
2. Set how many shares you pay for (e.g. `2` if covering you + one friend)
3. Add an on-chain memo (e.g. `Pizza split`)
4. Paste a recipient Stellar address (another testnet wallet)
5. Click **Send my split payment** and approve in Freighter
6. Use **Copy split summary** to share per-person amount + app link

## Project Structure

```
src/
├── app/
├── components/
│   ├── SplitPayApp.tsx
│   ├── SplitCalculator.tsx   # Split-first UI + copy summary
│   ├── LanguageToggle.tsx    # EN / TR
│   ├── WalletButton.tsx
│   ├── BalanceCard.tsx
│   └── TransactionFeedback.tsx
└── lib/
    ├── stellar.ts            # Freighter + Horizon + Memo.text payments
    ├── split.ts
    └── i18n.ts
public/
└── screenshots/              # Submission screenshots (4 required)
```

## Deploy (Vercel)

1. Push to a **public** GitHub repository
2. Import repo at [vercel.com/new](https://vercel.com/new) — Next.js auto-detected
3. No env vars required (Horizon testnet URL is hardcoded)
4. Optional: add `NEXT_PUBLIC_APP_URL` in Vercel → Settings → Environment Variables
5. Paste live URL into README

## Submission Screenshots

Save under `public/screenshots/`:

1. `01-wallet-connected.png` — Freighter connected, address visible
2. `02-balance.png` — XLM balance displayed
3. `03-transaction-success.png` — Successful testnet payment
4. `04-transaction-hash.png` — Hash + Stellar Expert link shown to user

## White Belt Checklist

- [x] Freighter + Stellar Testnet
- [x] Wallet connect / disconnect
- [x] XLM balance from Horizon
- [x] Send XLM on testnet
- [x] Success / failure feedback with transaction hash
- [x] On-chain memo support
- [x] EN / TR UI
- [ ] Public GitHub repository
- [ ] Deploy to Vercel
- [ ] README live URL + screenshots attached

## License

MIT
