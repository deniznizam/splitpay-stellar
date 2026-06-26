"use client";

import type { Copy } from "@/lib/i18n";
import { formatXlm } from "@/lib/split";

type BalanceCardProps = {
  copy: Copy;
  balance: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onFund?: () => void;
  isFunding?: boolean;
};

export function BalanceCard({
  copy: t,
  balance,
  isLoading,
  onRefresh,
  onFund,
  isFunding,
}: BalanceCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{t.balanceLabel}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {isLoading ? "…" : `${formatXlm(Number(balance ?? 0))} XLM`}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t.balanceSource}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/5 disabled:opacity-50"
          >
            {t.refresh}
          </button>
          {onFund ? (
            <button
              type="button"
              onClick={onFund}
              disabled={isFunding}
              className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-200 hover:bg-sky-400/20 disabled:opacity-50"
            >
              {isFunding ? t.funding : t.getTestXlm}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
