"use client";

import type { Copy } from "@/lib/i18n";
import { formatXlm } from "@/lib/split";
import { formatAddress } from "@/lib/stellar";
import { getAppUrl } from "@/lib/i18n";

type TransactionFeedbackProps = {
  copy: Copy;
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  hash?: string;
  explorerUrl?: string;
  totalBill?: string;
  perPersonShare?: number;
  yourShare?: number;
  recipient?: string;
  memo?: string;
};

export function TransactionFeedback({
  copy: t,
  status,
  message,
  hash,
  explorerUrl,
  totalBill = "0",
  perPersonShare = 0,
  yourShare = 0,
  recipient = "",
  memo = "",
}: TransactionFeedbackProps) {
  if (status === "idle") return null;

  const styles = {
    loading: "border-sky-400/30 bg-sky-400/10 text-sky-100",
    success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
    error: "border-rose-400/30 bg-rose-400/10 text-rose-100",
  } as const;

  // Build social share text
  const hostShort = recipient ? formatAddress(recipient, 4, 4) : "Host";
  const shareText = t.shareText(
    totalBill,
    formatXlm(perPersonShare),
    formatXlm(yourShare),
    hostShort
  );
  
  const appUrl = getAppUrl();
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " Pay here: " + appUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      <section
        className={`rounded-2xl border p-5 ${styles[status === "loading" ? "loading" : status]}`}
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden>
            {status === "loading" && "⏳"}
            {status === "success" && "✅"}
            {status === "error" && "⚠️"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {status === "loading" && t.txLoadingTitle}
              {status === "success" && t.txSuccessTitle}
              {status === "error" && t.txErrorTitle}
            </p>
            {message ? <p className="mt-1 text-sm opacity-90">{message}</p> : null}
            {hash ? (
              <p className="mt-3 break-all font-mono text-xs opacity-80">
                {t.hashLabel}: {hash}
              </p>
            ) : null}
            {explorerUrl ? (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
              >
                {t.viewExplorer}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* Printable Receipt and Share Section on Success */}
      {status === "success" && hash && (
        <section className="relative rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
          {/* Jagged border simulation */}
          <div className="absolute left-4 right-4 top-0 -translate-y-1/2 overflow-hidden text-neutral-800 select-none pointer-events-none font-mono text-[10px] tracking-widest text-center">
            ▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼
          </div>

          <div className="text-center font-mono mt-2">
            <h3 className="text-xs font-bold tracking-widest text-slate-400">
              *** {t.receiptHeader} ***
            </h3>
            <p className="text-[9px] text-emerald-400 mt-1 uppercase font-bold tracking-wider">
              -- TRANSACTION SUCCESSFUL --
            </p>
            <div className="border-t border-dashed border-neutral-800 my-4" />
          </div>

          <div className="font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">TX STATUS</span>
              <span className="text-emerald-400 font-bold">SETTLED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TX HASH</span>
              <span className="text-slate-300 font-mono">{formatAddress(hash, 8, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">HOST ADDR</span>
              <span className="text-slate-300 font-mono">{formatAddress(recipient, 6, 6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MEMO TEXT</span>
              <span className="text-violet-300">{memo || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TOTAL BILL</span>
              <span className="text-slate-300">{totalBill} XLM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PER PERSON SHARE</span>
              <span className="text-slate-300">{formatXlm(perPersonShare)} XLM</span>
            </div>

            <div className="border-t border-dashed border-neutral-800 my-4" />

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-bold text-slate-300">AMOUNT TRANSFERRED</span>
              <span className="text-xl font-bold text-emerald-400">
                {formatXlm(yourShare)} XLM
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-dashed border-neutral-800 pt-4 text-center font-mono text-[9px] text-neutral-600">
            <p>{t.receiptFooter}</p>
            <p className="mt-1">REF-TX-{hash.slice(0, 8).toUpperCase()}</p>
          </div>

          {/* Social Share actions */}
          <div className="mt-6 border-t border-neutral-800 pt-4">
            <p className="text-xs font-semibold text-slate-400 mb-3">{t.shareTitle}</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition shadow-md shadow-emerald-950"
              >
                <span>💬</span> {t.shareWhatsapp}
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white py-2.5 text-xs font-bold transition shadow-md shadow-sky-950"
              >
                <span>✈️</span> {t.shareTelegram}
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
