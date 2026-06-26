"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BalanceCard } from "@/components/BalanceCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SplitCalculator } from "@/components/SplitCalculator";
import { TransactionFeedback } from "@/components/TransactionFeedback";
import { WalletButton } from "@/components/WalletButton";
import { copy, type Locale } from "@/lib/i18n";
import {
  calculateSplit,
  parsePayForCount,
  parsePeopleCount,
  parsePositiveNumber,
} from "@/lib/split";
import {
  checkWalletConnection,
  connectWallet,
  fundTestnetAccount,
  getXlmBalance,
  sendXlmPayment,
} from "@/lib/stellar";

type TxState = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  hash?: string;
  explorerUrl?: string;
};

export function SplitPayApp() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = copy[locale];

  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [txState, setTxState] = useState<TxState>({ status: "idle" });
  const [error, setError] = useState<string | null>(null);

  const [totalBill, setTotalBill] = useState("100");
  const [numPeople, setNumPeople] = useState("4");
  const [payForCount, setPayForCount] = useState("1");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("SplitPay");

  const refreshBalance = useCallback(async (address: string) => {
    setIsBalanceLoading(true);
    try {
      const xlm = await getXlmBalance(address);
      setBalance(xlm);
    } catch {
      setBalance("0");
      setError(t.balanceLoadError);
    } finally {
      setIsBalanceLoading(false);
    }
  }, [t.balanceLoadError]);

  useEffect(() => {
    void (async () => {
      try {
        const address = await checkWalletConnection();
        if (address) {
          setPublicKey(address);
          await refreshBalance(address);
        }
      } catch {
        // Freighter not available until user interacts
      }
    })();
  }, [refreshBalance]);

  const split = useMemo(() => {
    const bill = parsePositiveNumber(totalBill);
    const people = parsePeopleCount(numPeople);
    const payingFor = people ? parsePayForCount(payForCount, people) : null;

    if (!bill || !people || !payingFor) return null;
    return calculateSplit({
      totalBill: bill,
      numPeople: people,
      payForCount: payingFor,
    });
  }, [totalBill, numPeople, payForCount]);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setPublicKey(address);
      await refreshBalance(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.walletConnectError);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    setBalance(null);
    setTxState({ status: "idle" });
    setError(null);
  };

  const handleFund = async () => {
    if (!publicKey) return;
    setError(null);
    setIsFunding(true);
    try {
      await fundTestnetAccount(publicKey);
      await refreshBalance(publicKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.fundingError);
    } finally {
      setIsFunding(false);
    }
  };

  const handleSelectScenario = (total: string, people: string, payFor: string, recipientHost: string, memoString: string) => {
    setTotalBill(total);
    setNumPeople(people);
    setPayForCount(payFor);
    setRecipient(recipientHost);
    setMemo(memoString);
  };

  const handleSendSplit = async () => {
    if (!publicKey || !split) return;

    setError(null);
    setTxState({ status: "loading", message: t.txWaiting });
    setIsSending(true);

    try {
      const result = await sendXlmPayment({
        from: publicKey,
        to: recipient.trim(),
        amount: split.yourShare.toFixed(7),
        memo,
      });

      setTxState({
        status: "success",
        message: t.txSuccessMessage(
          split.yourShare.toFixed(7),
          split.payForCount,
          split.numPeople
        ),
        hash: result.hash,
        explorerUrl: result.explorerUrl,
      });
      await refreshBalance(publicKey);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.sendError;
      setTxState({ status: "error", message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_40%)]" />

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
              {t.tagline}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-3 max-w-xl text-slate-400">{t.heroSubtitle}</p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <LanguageToggle locale={locale} onChange={setLocale} />
            <WalletButton
              copy={t}
              publicKey={publicKey}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="space-y-6">
          {publicKey ? (
            <BalanceCard
              copy={t}
              balance={balance}
              isLoading={isBalanceLoading}
              onRefresh={() => refreshBalance(publicKey)}
              onFund={handleFund}
              isFunding={isFunding}
            />
          ) : (
            <section className="rounded-3xl border border-dashed border-violet-500/20 bg-violet-950/10 p-6 text-center sm:p-8">
              <h2 className="text-xl font-semibold text-white">{t.connectPromptTitle}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{t.connectPromptBody}</p>
            </section>
          )}

          <SplitCalculator
            locale={locale}
            copy={t}
            totalBill={totalBill}
            numPeople={numPeople}
            payForCount={payForCount}
            recipient={recipient}
            memo={memo}
            split={split}
            isSending={isSending}
            isConnected={publicKey !== null}
            onTotalBillChange={setTotalBill}
            onNumPeopleChange={setNumPeople}
            onPayForCountChange={setPayForCount}
            onRecipientChange={setRecipient}
            onMemoChange={setMemo}
            onSubmit={handleSendSplit}
            onConnect={handleConnect}
            onSelectScenario={handleSelectScenario}
          />

          <TransactionFeedback
            copy={t}
            status={txState.status}
            message={txState.message}
            hash={txState.hash}
            explorerUrl={txState.explorerUrl}
            totalBill={totalBill}
            perPersonShare={split ? split.perPersonShare : 0}
            yourShare={split ? split.yourShare : 0}
            recipient={recipient}
            memo={memo}
          />
        </div>

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}
