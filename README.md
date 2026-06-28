# SplitPay — Stellar Testnet Bill Splitter

> **TR:** Arkadaşlarla restoran hesabı veya grup masraflarını kolayca böl, payını Stellar testnet üzerinden anında gönder.

SplitPay is a responsive web dApp for the **Stellar White Belt** challenge. Enter a total, choose how many people are sharing, pick how many shares you pay for, and send your calculated XLM portion on **Stellar testnet** via **Freighter**.

---

## Live Demo

`[Vercel URL — deploy sonrası ekle]`

---

## Screenshots / Ekran Görüntüleri

> **TR:** Jüri için tüm akış ekran görüntüleri aşağıdadır.

![Wallet Connected](public/screenshots/Screenshot%202026-06-27%20220006.png)
![Balance Display](public/screenshots/Screenshot%202026-06-27%20220022.png)
![Split Calculator](public/screenshots/Screenshot%202026-06-27%20220119.png)
![Receipt Preview](public/screenshots/Screenshot%202026-06-27%20220150.png)
![Transaction Pending](public/screenshots/Screenshot%202026-06-27%20220219.png)
![Transaction Success](public/screenshots/Screenshot%202026-06-27%20220236.png)
![Confetti Animation](public/screenshots/Screenshot%202026-06-27%20220243.png)
![Multi-Pay](public/screenshots/Screenshot%202026-06-27%20220436.png)
![Explorer Link](public/screenshots/Screenshot%202026-06-27%20220443.png)

---

## Features

> **TR:** Cüzdan bağlantısı, bakiye görüntüleme, hesap bölme, XLM gönderimi, işlem geri bildirimi, çoklu ödeme, QR kod, USD karşılığı ve daha fazlası.

- **Freighter wallet integration** — connect / disconnect with `@stellar/freighter-api`
- **Live XLM balance** — fetched from Horizon with live XLM → USD conversion (CoinGecko)
- **Copy address** — one-click clipboard copy of your own Stellar address
- **Split-first UX** — total bill, group size, and "you pay for N people" with instant share calculation
- **Balance guard** — send button disabled automatically when balance is insufficient
- **Recipient validation** — debounced testnet account existence check before sending
- **QR code** — shows recipient address as scannable QR when address is verified
- **Copy split summary** — one-click clipboard message with per-person share + app link
- **Multi-Pay** — bundle payments to multiple recipients into a single Stellar transaction (multi-op)
- **On-chain memo (Text)** — embedded via `Memo.text()` in `TransactionBuilder`, visible on Stellar Expert
- **EN / TR UI toggle** — English default for global jury; Turkish for local demos
- **Testnet payments** — `TransactionBuilder` + Freighter signing + Horizon submission
- **Transaction feedback** — loading state, success/error, transaction hash, Stellar Expert link
- **Confetti animation** — celebratory particle burst on successful payment
- **Friendbot shortcut** — one-click testnet funding when balance is empty

---

## Stellar Standards Highlight

> **TR:** İşlemlere `Memo.text()` ile zincir üstü not eklenir (maks. 28 karakter). Stellar Expert'te herkese açık olarak görünür, harici veritabanı gerekmez.

Payments attach an optional **Memo (Text)** field (max 28 characters) using the Stellar SDK. This follows Stellar's on-ledger metadata pattern — no off-chain database required for payment context. Reviewers can verify memos on [Stellar Expert (testnet)](https://stellar.expert/explorer/testnet).

---

## Tech Stack

> **TR:** Next.js 14, TypeScript, Tailwind CSS, Stellar SDK, Freighter API.

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- `@stellar/stellar-sdk`
- `@stellar/freighter-api`

---

## Local Setup

> **TR:** Kurulum için Freighter eklentisini yükle, ağı Testnet'e al, aşağıdaki komutları çalıştır.

### Prerequisites

1. [Freighter](https://www.freighter.app/) browser extension
2. Freighter set to **Testnet** (Settings → Network → Testnet)
3. Node.js 18+

### Run locally

```bash
git clone https://github.com/deniznizam/splitpay-stellar.git
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

> **TR:** `NEXT_PUBLIC_APP_URL` — "Özeti Kopyala" butonunun oluşturduğu mesajın sonundaki link. Vercel'e deploy sonrası gerçek URL'inizi yazın. Yazılmazsa tarayıcının adresi kullanılır.

### Get testnet XLM

> **TR:** Bakiyeniz 0 ise uygulamadaki "Bedava Test Parası Al" butonuna basın.

1. Connect your wallet in the app
2. Click **Get test XLM**, or use [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

### Try a split payment

> **TR:** Demo senaryodan birini seç → kendi adresini alıcı olarak gir → "Payımı Gönder" → Freighter'da onayla.

1. Select a demo scenario (Pizza Night, Dinner at Luna, Coffee Break)
2. Enter a valid testnet recipient address (or your own address to test)
3. Add an on-chain memo (e.g. `Pizza split`)
4. Click **Pay My Share Now** and approve in Freighter
5. Watch the confetti 🎊 and verify on Stellar Expert

---

## Project Structure

> **TR:** `src/components/` altında UI bileşenleri, `src/lib/` altında Stellar/i18n/split mantığı bulunur.

```
src/
├── app/
├── components/
│   ├── SplitPayApp.tsx
│   ├── SplitCalculator.tsx   # Split UI + QR + account validation
│   ├── MultiPay.tsx          # Multi-recipient single-tx payments
│   ├── Confetti.tsx          # Canvas confetti animation
│   ├── LanguageToggle.tsx    # EN / TR
│   ├── WalletButton.tsx
│   ├── BalanceCard.tsx       # Balance + USD price + copy address
│   └── TransactionFeedback.tsx
└── lib/
    ├── stellar.ts            # Freighter + Horizon + Memo.text + multi-op
    ├── split.ts
    └── i18n.ts
public/
├── images/
└── screenshots/
```

---

## Deploy (Vercel)

> **TR:** Vercel'de GitHub reposunu seç, Next.js otomatik algılanır, deploy et.

1. Push to a **public** GitHub repository
2. Import repo at [vercel.com/new](https://vercel.com/new) — Next.js auto-detected
3. No env vars required (Horizon testnet URL is hardcoded)
4. Optional: add `NEXT_PUBLIC_APP_URL` in Vercel → Settings → Environment Variables
5. Paste live URL into README

---

## White Belt Checklist

- [x] Freighter + Stellar Testnet
- [x] Wallet connect / disconnect
- [x] XLM balance from Horizon
- [x] Send XLM on testnet
- [x] Success / failure feedback with transaction hash
- [x] On-chain memo support
- [x] EN / TR UI
- [x] Public GitHub repository → https://github.com/deniznizam/splitpay-stellar
- [ ] Deploy to Vercel → `[Vercel URL buraya ekle]`
- [ ] README live URL + screenshots attached

---

## License

MIT
