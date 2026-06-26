import {
  isConnected,
  getAddress,
  setAllowed,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const EXPLORER_BASE = "https://stellar.expert/explorer/testnet";

const server = new Horizon.Server(HORIZON_URL);

export function isValidPublicKey(address: string): boolean {
  return StrKey.isValidEd25519PublicKey(address);
}

export function formatAddress(address: string, start = 4, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}…${address.slice(-end)}`;
}

export function getExplorerLink(hash: string, type: "tx" | "account" = "tx"): string {
  return `${EXPLORER_BASE}/${type}/${hash}`;
}

export async function connectWallet(): Promise<string> {
  const allowed = await setAllowed();
  if (!allowed) {
    throw new Error("Wallet connection was rejected. Please approve Freighter.");
  }

  const { address } = await getAddress();
  if (!address) {
    throw new Error("Could not read a Stellar address from Freighter.");
  }

  return address;
}

export async function checkWalletConnection(): Promise<string | null> {
  const connected = await isConnected();
  if (!connected) return null;

  const { address } = await getAddress();
  return address ?? null;
}

export async function getXlmBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey);
  const native = account.balances.find((b) => b.asset_type === "native");
  return native?.balance ?? "0";
}

export async function fundTestnetAccount(publicKey: string): Promise<void> {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );

  if (!response.ok) {
    throw new Error("Friendbot funding failed. Try again from Stellar Laboratory.");
  }
}

export type SendPaymentInput = {
  from: string;
  to: string;
  amount: string;
  memo?: string;
};

export type SendPaymentResult = {
  hash: string;
  explorerUrl: string;
};

export async function sendXlmPayment(
  input: SendPaymentInput
): Promise<SendPaymentResult> {
  const { from, to, amount, memo } = input;

  if (!isValidPublicKey(to)) {
    throw new Error("Recipient address is not a valid Stellar public key.");
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const sourceAccount = await server.loadAccount(from);
  const transactionBuilder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(
    Operation.payment({
      destination: to,
      asset: Asset.native(),
      amount: parsedAmount.toFixed(7),
    })
  );

  if (memo?.trim()) {
    transactionBuilder.addMemo(Memo.text(memo.trim().slice(0, 28)));
  }

  const transaction = transactionBuilder.setTimeout(30).build();
  const signed = await signTransaction(transaction.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  if ("error" in signed && signed.error) {
    throw new Error(signed.error.message ?? "Transaction signing was rejected in Freighter.");
  }

  const result = await server.submitTransaction(
    TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK_PASSPHRASE)
  );

  const hash = result.hash;
  return {
    hash,
    explorerUrl: getExplorerLink(hash),
  };
}
