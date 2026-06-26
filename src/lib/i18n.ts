import { formatXlm } from "@/lib/split";

export type Locale = "en" | "tr";

export type Copy = {
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  connectPromptTitle: string;
  connectPromptBody: string;
  balanceLabel: string;
  balanceSource: string;
  refresh: string;
  getTestXlm: string;
  funding: string;
  splitEyebrow: string;
  splitTitle: string;
  splitDescription: string;
  totalBill: string;
  peopleAtTable: string;
  youPayFor: string;
  youPayForHint: string;
  perPerson: string;
  yourShare: string;
  recipient: string;
  recipientHint: string;
  memoLabel: string;
  memoPlaceholder: string;
  memoHint: string;
  copySummary: string;
  copiedSummary: string;
  sendPayment: string;
  sendingPayment: string;
  connectToPay: string;
  connected: string;
  connectFreighter: string;
  connecting: string;
  disconnect: string;
  txLoadingTitle: string;
  txSuccessTitle: string;
  txErrorTitle: string;
  txWaiting: string;
  viewExplorer: string;
  hashLabel: string;
  footer: string;
  balanceLoadError: string;
  walletConnectError: string;
  fundingError: string;
  sendError: string;
  txSuccessMessage: (amount: string, payFor: number, total: number) => string;
  
  // New UI/UX labels
  scenariosLabel: string;
  pizzaNightName: string;
  lunaDinnerName: string;
  coffeeBreakName: string;
  hostLabel: string;
  youLabel: string;
  friendLabel: string;
  receivesLabel: string;
  paysLabel: string;
  unpaidLabel: string;
  receiptHeader: string;
  receiptFooter: string;
  shareTitle: string;
  shareWhatsapp: string;
  shareTelegram: string;
  shareText: (total: string, share: string, yours: string, host: string) => string;
};

const en: Copy = {
  tagline: "Stellar Testnet",
  heroTitle: "SplitPay",
  heroSubtitle:
    "Split restaurant bills and group expenses, then pay your share instantly with XLM on Stellar testnet.",
  connectPromptTitle: "Connect to start splitting",
  connectPromptBody:
    "Install Freighter, switch to Testnet, then connect your wallet to calculate shares and send XLM.",
  balanceLabel: "Your XLM balance",
  balanceSource: "Stellar Testnet · live from Horizon",
  refresh: "Refresh",
  getTestXlm: "Get test XLM",
  funding: "Funding…",
  splitEyebrow: "Split the bill",
  splitTitle: "Calculate your share, pay in XLM",
  splitDescription:
    "Enter the total bill and group size. SplitPay calculates each person's share and sends your portion on Stellar testnet.",
  totalBill: "Total bill (XLM)",
  peopleAtTable: "People at the table",
  youPayFor: "You pay for",
  youPayForHint: "people (including yourself)",
  perPerson: "Per person",
  yourShare: "Your share to send",
  recipient: "Host Stellar address (Recipient)",
  recipientHint: "The friend who paid the full bill and will receive your split shares.",
  memoLabel: "On-chain memo (optional)",
  memoPlaceholder: "Pizza split",
  memoHint:
    "Embedded in the transaction as Stellar Memo (Text, max 28 chars) — visible on Stellar Expert.",
  copySummary: "Copy split summary",
  copiedSummary: "Copied!",
  sendPayment: "Send my split payment",
  sendingPayment: "Signing & sending on testnet…",
  connectToPay: "Connect wallet to pay",
  connected: "Connected",
  connectFreighter: "Connect Freighter",
  connecting: "Connecting…",
  disconnect: "Disconnect",
  txLoadingTitle: "Transaction in progress",
  txSuccessTitle: "Payment sent on testnet",
  txErrorTitle: "Transaction failed",
  txWaiting: "Waiting for Freighter signature…",
  viewExplorer: "View on Stellar Expert →",
  hashLabel: "Hash",
  footer: "SplitPay · White Belt submission · Freighter + Horizon + Stellar SDK on testnet only",
  balanceLoadError: "Could not load balance. Fund your testnet account and try again.",
  walletConnectError: "Wallet connection failed.",
  fundingError: "Funding failed.",
  sendError: "Something went wrong sending the payment.",
  txSuccessMessage: (amount, payFor, total) =>
    `Sent ${amount} XLM for ${payFor} of ${total} shares.`,

  // New UI/UX labels
  scenariosLabel: "Select a demo scenario:",
  pizzaNightName: "🍕 Pizza Night",
  lunaDinnerName: "🍽️ Dinner at Luna",
  coffeeBreakName: "☕ Coffee Break",
  hostLabel: "Host (Receives)",
  youLabel: "You (Payer)",
  friendLabel: "Friend",
  receivesLabel: "receives",
  paysLabel: "pays",
  unpaidLabel: "unpaid share",
  receiptHeader: "BILL SPLIT RECEIPT",
  receiptFooter: "THANK YOU FOR USING SPLITPAY",
  shareTitle: "Share payment details:",
  shareWhatsapp: "WhatsApp",
  shareTelegram: "Telegram",
  shareText: (total, share, yours, host) =>
    `We split the bill with SplitPay! Total bill: ${total} XLM. Per person share: ${share} XLM. I paid my share of ${yours} XLM to Host ${host}.`,
};

const tr: Copy = {
  tagline: "Stellar Testnet",
  heroTitle: "SplitPay",
  heroSubtitle:
    "Grup harcamalarını bölüştürün ve payınızı Stellar testnet üzerinde XLM ile anında ödeyin.",
  connectPromptTitle: "Başlamak için cüzdanı bağlayın",
  connectPromptBody:
    "Freighter kurun, Testnet'e geçin, ardından pay hesaplamak ve XLM göndermek için cüzdanınızı bağlayın.",
  balanceLabel: "XLM bakiyeniz",
  balanceSource: "Stellar Testnet · Horizon canlı verisi",
  refresh: "Yenile",
  getTestXlm: "Test XLM al",
  funding: "Yükleniyor…",
  splitEyebrow: "Hesabı böl",
  splitTitle: "Payını hesapla, XLM ile öde",
  splitDescription:
    "Toplam tutarı ve kişi sayısını girin. SplitPay kişi başı payı hesaplar ve sizin payınızı Stellar testnet'e gönderir.",
  totalBill: "Toplam hesap (XLM)",
  peopleAtTable: "Masadaki kişi sayısı",
  youPayFor: "Sen kaç kişi için ödüyorsun",
  youPayForHint: "kişi (kendin dahil)",
  perPerson: "Kişi başı",
  yourShare: "Göndereceğin pay",
  recipient: "Host Stellar adresi (Alıcı)",
  recipientHint: "Hesabın tamamını ödeyen ve sizin payınızı alacak olan arkadaşınız.",
  memoLabel: "Zincir üstü memo (isteğe bağlı)",
  memoPlaceholder: "Pizza hesabı",
  memoHint:
    "İşleme Stellar Memo (Text, max 28 karakter) olarak gömülür — Stellar Expert'te görünür.",
  copySummary: "Özet linkini kopyala",
  copiedSummary: "Kopyalandı!",
  sendPayment: "Payımı gönder",
  sendingPayment: "Testnet'e imzalanıyor ve gönderiliyor…",
  connectToPay: "Ödemek için cüzdanı bağla",
  connected: "Bağlı",
  connectFreighter: "Freighter bağla",
  connecting: "Bağlanıyor…",
  disconnect: "Bağlantıyı kes",
  txLoadingTitle: "İşlem devam ediyor",
  txSuccessTitle: "Ödeme testnet'e gönderildi",
  txErrorTitle: "İşlem başarısız",
  txWaiting: "Freighter imzası bekleniyor…",
  viewExplorer: "Stellar Expert'te gör →",
  hashLabel: "Hash",
  footer: "SplitPay · White Belt · Freighter + Horizon + Stellar SDK · yalnızca testnet",
  balanceLoadError: "Bakiye yüklenemedi. Testnet hesabınızı fund edip tekrar deneyin.",
  walletConnectError: "Cüzdan bağlantısı başarısız.",
  fundingError: "Fund işlemi başarısız.",
  sendError: "Ödeme gönderilirken bir hata oluştu.",
  txSuccessMessage: (amount, payFor, total) =>
    `${total} paydan ${payFor} tanesi için ${amount} XLM gönderildi.`,

  // New UI/UX labels
  scenariosLabel: "Bir demo senaryosu seçin:",
  pizzaNightName: "🍕 Pizza Gecesi",
  lunaDinnerName: "🍽️ Luna Akşam Yemeği",
  coffeeBreakName: "☕ Kahve Molası",
  hostLabel: "Host (Alıcı)",
  youLabel: "Siz (Ödeyen)",
  friendLabel: "Arkadaş",
  receivesLabel: "alır",
  paysLabel: "öder",
  unpaidLabel: "ödenmemiş pay",
  receiptHeader: "ADİSYON DETAYI",
  receiptFooter: "SPLITPAY'İ TERCİH ETTİĞİNİZ İÇİN TEŞEKKÜRLER",
  shareTitle: "Ödeme detayını paylaş:",
  shareWhatsapp: "WhatsApp",
  shareTelegram: "Telegram",
  shareText: (total, share, yours, host) =>
    `Hesabı SplitPay ile bölüştük! Toplam: ${total} XLM. Kişi başı düşen pay: ${share} XLM. Host ${host} adresine ${yours} XLM payımı ödedim.`,
};

export const copy: Record<Locale, Copy> = { en, tr };

export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://your-splitpay.vercel.app";
}

export function buildShareSummary(
  locale: Locale,
  perPersonShare: number,
  appUrl = getAppUrl()
): string {
  const amount = `${formatXlm(perPersonShare)} XLM`;

  if (locale === "tr") {
    return `SplitPay ile hesaplaştık! Kişi başı düşen pay: ${amount}. Ödemek için: ${appUrl}`;
  }

  return `We split with SplitPay! Per person: ${amount}. Pay here: ${appUrl}`;
}
