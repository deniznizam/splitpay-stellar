"use client";

import { useState } from "react";
import type { Copy } from "@/lib/i18n";
import { buildShareSummary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { SplitResult, formatXlm } from "@/lib/split";
import { formatAddress } from "@/lib/stellar";

type SplitCalculatorProps = {
  locale: Locale;
  copy: Copy;
  totalBill: string;
  numPeople: string;
  payForCount: string;
  recipient: string;
  memo: string;
  split: SplitResult | null;
  isSending: boolean;
  isConnected: boolean;
  onTotalBillChange: (value: string) => void;
  onNumPeopleChange: (value: string) => void;
  onPayForCountChange: (value: string) => void;
  onRecipientChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onSubmit: () => void;
  onConnect: () => void;
  onSelectScenario: (total: string, people: string, payFor: string, recipient: string, memo: string) => void;
};

export function SplitCalculator({
  locale,
  copy: t,
  totalBill,
  numPeople,
  payForCount,
  recipient,
  memo,
  split,
  isSending,
  isConnected,
  onTotalBillChange,
  onNumPeopleChange,
  onPayForCountChange,
  onRecipientChange,
  onMemoChange,
  onSubmit,
  onConnect,
  onSelectScenario,
}: SplitCalculatorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    if (!split) return;
    const text = buildShareSummary(locale, split.perPersonShare);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  // Generate individual shares list
  const shareBreakdown = (() => {
    if (!split) return [];
    const items = [];
    
    // Host is always participant #1 (index 0)
    const hostAddressShort = recipient ? formatAddress(recipient, 4, 4) : "GB...Host";
    items.push({
      role: "host",
      name: `${t.hostLabel} (Ali)`,
      detail: hostAddressShort,
      amount: split.perPersonShare,
      status: t.receivesLabel,
      color: "text-emerald-400",
    });

    // You are participant #2 (index 1)
    const payForNum = Number(payForCount) || 1;
    items.push({
      role: "you",
      name: t.youLabel,
      detail: payForNum > 1 ? `${payForNum} shares` : "1 share",
      amount: split.yourShare,
      status: t.paysLabel,
      color: "text-violet-400 font-bold",
    });

    // The rest are other friends (indices 2+)
    const remainingPeople = split.numPeople - 1 - payForNum;
    if (remainingPeople > 0) {
      for (let i = 0; i < remainingPeople; i++) {
        items.push({
          role: "friend",
          name: `${t.friendLabel} ${i + 2}`,
          detail: "1 share",
          amount: split.perPersonShare,
          status: t.unpaidLabel,
          color: "text-slate-400",
        });
      }
    }
    return items;
  })();

  const demoScenarios = [
    {
      id: "pizza",
      name: t.pizzaNightName,
      total: "100",
      people: "4",
      payFor: "1",
      host: "GBRPYHIL2CIWTCQ6TQ5HQVN675FWG2W263ZJF6TH673DNDO3Z7PFR32B",
      memo: "Pizza Night",
    },
    {
      id: "luna",
      name: t.lunaDinnerName,
      total: "240",
      people: "6",
      payFor: "2",
      host: "GDU523P6X6PVMNYKGDW5QMX7ZTYO7T7BOK2Z3Z7PFR32BNDO3Z7PFR111",
      memo: "Dinner at Luna",
    },
    {
      id: "coffee",
      name: t.coffeeBreakName,
      total: "30",
      people: "3",
      payFor: "1",
      host: "GCQ6TQ5HQVN675FWG2W263ZJF6TH673DNDO3Z7PFR32BNDO3Z7PFR888",
      memo: "Coffee Break",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left Column: Form Controls */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md lg:col-span-7 sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            {t.splitEyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{t.splitTitle}</h2>
          <p className="mt-2 text-sm text-slate-400">{t.splitDescription}</p>
        </div>

        {/* Demo Scenarios Section */}
        <div className="mb-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            {t.scenariosLabel}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {demoScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectScenario(s.total, s.people, s.payFor, s.host, s.memo)}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-slate-950"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t.totalBill}</span>
            <input
              type="number"
              min="0"
              step="0.0000001"
              value={totalBill}
              onChange={(e) => onTotalBillChange(e.target.value)}
              placeholder="120.50"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-violet-400/40 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t.peopleAtTable}</span>
            <input
              type="number"
              min="2"
              step="1"
              value={numPeople}
              onChange={(e) => onNumPeopleChange(e.target.value)}
              placeholder="4"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-violet-400/40 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t.youPayFor}</span>
            <input
              type="number"
              min="1"
              step="1"
              value={payForCount}
              onChange={(e) => onPayForCountChange(e.target.value)}
              placeholder="1"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-violet-400/40 focus:ring-2"
            />
            <span className="mt-1 block text-[11px] leading-tight text-slate-500">{t.youPayForHint}</span>
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t.recipient}</span>
            <input
              type="text"
              value={recipient}
              onChange={(e) => onRecipientChange(e.target.value)}
              placeholder="G…"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-xs text-white outline-none ring-violet-400/40 focus:ring-2"
            />
            <span className="mt-1 block text-xs text-slate-500">{t.recipientHint}</span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t.memoLabel}</span>
            <input
              type="text"
              maxLength={28}
              value={memo}
              onChange={(e) => onMemoChange(e.target.value)}
              placeholder={t.memoPlaceholder}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-violet-400/40 focus:ring-2"
            />
            <span className="mt-2 block text-xs leading-relaxed text-slate-500">{t.memoHint}</span>
          </label>
        </div>

        {isConnected ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSending || !split || !recipient.trim()}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? t.sendingPayment : t.sendPayment}
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="mt-6 w-full rounded-2xl bg-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500"
          >
            {t.connectToPay}
          </button>
        )}
      </section>

      {/* Right Column: Receipt UI Metaphor & Split Breakdown */}
      <section className="lg:col-span-5">
        {split ? (
          <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-md">
            {/* Dotted border top simulation */}
            <div className="absolute left-4 right-4 top-0 -translate-y-1/2 overflow-hidden text-neutral-800 select-none pointer-events-none font-mono text-[10px] tracking-widest text-center">
              ▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼
            </div>

            <div className="text-center font-mono mt-2">
              <h3 className="text-sm font-bold tracking-widest text-slate-300">
                *** {t.receiptHeader} ***
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">
                SPLITPAY SYSTEM v6.0 · TESTNET
              </p>
              <div className="border-t border-dashed border-neutral-700 my-4" />
            </div>

            {/* Receipt detail lines */}
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">TOTAL BILL</span>
                <span className="text-white font-semibold">{formatXlm(split.totalBill)} XLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PEOPLE COUNT</span>
                <span className="text-white">{split.numPeople}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">YOUR PORTION</span>
                <span className="text-white">{split.payForCount} shares</span>
              </div>
              {memo.trim() && (
                <div className="flex justify-between">
                  <span className="text-slate-400">MEMO (ON-CHAIN)</span>
                  <span className="text-violet-300 truncate max-w-[150px]">{memo.trim()}</span>
                </div>
              )}

              <div className="border-t border-dashed border-neutral-700 my-4" />

              {/* Shares Breakdown Section */}
              <div className="font-sans">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2 font-mono">
                  PARTICIPANTS DETAILS
                </p>
                <div className="space-y-2">
                  {shareBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-neutral-950/40 p-2.5 border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.detail}</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs font-mono font-medium text-slate-200">
                          {formatXlm(item.amount)} XLM
                        </span>
                        <span className={`text-[9px] uppercase tracking-wider ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dashed border-neutral-700 my-4" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-bold text-slate-300">PER PERSON SHARE</span>
                <span className="text-lg font-bold text-white">
                  {formatXlm(split.perPersonShare)} XLM
                </span>
              </div>

              <div className="flex justify-between items-baseline mt-1 rounded-2xl bg-violet-500/10 p-3 border border-violet-500/30">
                <span className="text-xs font-bold text-violet-300">YOUR TOTAL DUE</span>
                <span className="text-2xl font-black text-white">
                  {formatXlm(split.yourShare)} XLM
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-dashed border-neutral-700 pt-4 text-center font-mono text-[9px] text-neutral-500">
              <p>{t.receiptFooter}</p>
              <p className="mt-1">ST-#{Math.floor(Math.random() * 100000)}</p>
            </div>

            {/* Dotted border bottom simulation */}
            <div className="absolute left-4 right-4 bottom-0 translate-y-1/2 overflow-hidden text-neutral-800 select-none pointer-events-none font-mono text-[10px] tracking-widest text-center">
              ▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full rounded-2xl border border-sky-400/30 bg-sky-400/5 px-4 py-3 text-xs font-semibold text-sky-100 transition hover:bg-sky-400/15"
              >
                {copied ? t.copiedSummary : t.copySummary}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/30 p-8 text-center">
            <span className="text-4xl">🧾</span>
            <h4 className="mt-3 text-sm font-semibold text-slate-300">Adisyon Hesaplanıyor</h4>
            <p className="mt-1 max-w-[200px] text-xs text-slate-500">
              Lütfen sol taraftaki bilgileri doldurarak adisyon detaylarını inceleyin.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
