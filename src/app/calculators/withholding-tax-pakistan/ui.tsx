"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPKR, parseInputNumber, whtRates, withCommas, type WhtCategory } from "@/lib/taxData";

const categoryLabels: Record<WhtCategory, string> = {
  salary: "Salary",
  cashWithdrawal: "Cash Withdrawal",
  bankProfit: "Bank Profit / Interest",
  dividendsListed: "Dividends (Listed Companies)",
  dividendsMutualFund: "Dividends (Mutual Fund)",
  propertyPurchase: "Property Purchase",
  propertySale: "Property Sale",
  goodsPayment: "Goods Payment",
  servicesGeneral: "Services (General)",
  servicesIT: "Services (IT / IT-enabled)",
  servicesTransport: "Services (Transport)",
  servicesContract: "Services (Contract)",
  rent: "Rent Payment",
  commission: "Commission / Brokerage",
  prizeBond: "Prize Bond / Lottery",
  auctionTender: "Auction / Sale by Tender",
  foreignCard: "Foreign Card Transaction",
  exportProceeds: "Export Proceeds",
  itExportPseb: "IT Export (PSEB)",
};

function InputField({
  label, hint, value, onChange, icon,
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void; icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
        {icon}{label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">₨</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(withCommas(e.target.value))}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 text-sm font-semibold text-slate-800 shadow-sm outline-none ring-0 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}

function CustomDropdown({
  label, hint, value, onChange, icon, options,
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void; icon: React.ReactNode;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
        {icon}{label}
      </span>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <span className="truncate">{selectedLabel}</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`ml-2 flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="max-h-64 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                    value === opt.value
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                    {value === opt.value && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-blue-600">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}

const track = (event: string, params: Record<string, string | number> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
};

export default function WithholdingTaxClient() {
  const [paymentAmount, setPaymentAmount] = useState("100,000");
  const [category, setCategory] = useState<WhtCategory>("servicesGeneral");
  const current = whtRates[category];

  const values = useMemo(() => {
    const amount = parseInputNumber(paymentAmount);
    const filerTax = amount * current.filer;
    const nonFilerTax = amount * current.nonFiler;
    return { filerTax, nonFilerTax, extra: nonFilerTax - filerTax, netFiler: amount - filerTax, netNonFiler: amount - nonFilerTax };
  }, [paymentAmount, current]);

  const waURL = `https://wa.me/923407300408?text=${encodeURIComponent(
    `Hi, I used your WHT calculator and my extra non-filer tax is PKR ${Math.round(values.extra)}. Help me become a filer.`,
  )}`;

  useEffect(() => {
    track("result_viewed", { calculator: "withholding-tax", extra_tax: Math.round(values.extra) });
  }, [values.extra]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Withholding Tax Calculator Pakistan 2025</h1>
        <p className="mt-1 text-sm text-slate-500">Finance Act 2025 · Filer vs Non-Filer WHT comparison</p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          {/* Transaction Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-sm">💸</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Transaction Details</h2>
                <p className="text-xs text-slate-400">Enter the payment amount and select the transaction category</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Payment Amount (PKR)"
                hint="The gross payment amount before WHT deduction"
                value={paymentAmount}
                onChange={(v) => { setPaymentAmount(v); track("calculator_used", { calculator: "withholding-tax", field: "payment_amount" }); }}
                icon={<span className="text-xs">💰</span>}
              />
              <CustomDropdown
                label="Transaction Category"
                hint="Select the type of payment to find the correct WHT section"
                value={category}
                onChange={(v) => setCategory(v as WhtCategory)}
                icon={<span className="text-xs">📋</span>}
                options={(Object.keys(whtRates) as WhtCategory[]).map((k) => ({ value: k, label: categoryLabels[k] }))}
              />
            </div>

            {/* Section info */}
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">{current.section}</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Filer {(current.filer * 100).toFixed(2)}% · Non-Filer {(current.nonFiler * 100).toFixed(2)}%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{current.note}</p>
            </div>
          </div>

          {/* Comparison breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                <span className="text-sm">⚖️</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Filer vs Non-Filer comparison</h2>
                <p className="text-xs text-slate-400">See exactly how much extra non-filers pay</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Filer — Tax Withheld</p>
                  <p className="text-[11px] text-emerald-500 opacity-70">{(current.filer * 100).toFixed(2)}% of payment amount</p>
                </div>
                <span className="text-sm font-bold text-emerald-700">{formatPKR(values.filerTax)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-red-700">Non-Filer — Tax Withheld</p>
                  <p className="text-[11px] text-red-500 opacity-70">{(current.nonFiler * 100).toFixed(2)}% of payment amount</p>
                </div>
                <span className="text-sm font-bold text-red-700">{formatPKR(values.nonFilerTax)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-orange-700">Extra Tax as Non-Filer</p>
                  <p className="text-[11px] text-orange-500 opacity-70">Amount you&apos;re overpaying every transaction</p>
                </div>
                <span className="text-sm font-bold text-orange-700">{formatPKR(values.extra)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] text-slate-500">Net received (Filer)</p>
                  <p className="text-sm font-bold text-slate-800">{formatPKR(values.netFiler)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] text-slate-500">Net received (Non-Filer)</p>
                  <p className="text-sm font-bold text-slate-800">{formatPKR(values.netNonFiler)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="px-5 pt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Extra Tax as Non-Filer</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-orange-400">{formatPKR(values.extra)}</p>
                <p className="mt-1 text-xs text-slate-400">{current.section} · {current.note}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-slate-700">
                <div className="border-r border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Filer Rate</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-400">{(current.filer * 100).toFixed(2)}%</p>
                  <p className="text-[10px] text-slate-500">{formatPKR(values.filerTax)} withheld</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Non-Filer Rate</p>
                  <p className="mt-1 text-lg font-semibold text-red-400">{(current.nonFiler * 100).toFixed(2)}%</p>
                  <p className="text-[10px] text-slate-500">{formatPKR(values.nonFilerTax)} withheld</p>
                </div>
              </div>
              {values.extra > 5000 && (
                <div className="border-t border-slate-700 p-5">
                  <a
                    href={waURL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("whatsapp_clicked", { calculator: "withholding-tax" })}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Become a Filer — Save {formatPKR(values.extra)}
                  </a>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-600">Become a filer today.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/personal/tax-return" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">FBR Tax Return</Link>
                <Link href="/personal/ntn" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">NTN Registration</Link>
                <Link href="/personal/filer" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Filer Status</Link>
                <Link href="/contact" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide / FAQ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Withholding Tax in Pakistan 2025-26 — complete guide</h2>
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What is Withholding Tax in Pakistan?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Withholding tax is advance tax deducted at source on specified payments. The payer usually deducts and deposits this amount under relevant legal sections.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Who Deducts Withholding Tax?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Employers, banks, property buyers, and companies paying vendors are common withholding agents. They are required by law to deduct and deposit the tax to FBR.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Can I Claim WHT Back in My Tax Return?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Yes, active filers can generally adjust allowable withholding amounts in the annual return and wealth statement workflow, reducing their net tax liability.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">WHT Rates for Services in Pakistan 2025-26</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">General services attract 15% (filer) vs 30% (non-filer) under Sec 153. IT services are taxed at 4% (filer) vs 8% (non-filer). Use the calculator above to compare your specific transaction category.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-sm font-semibold">Stop overpaying — become an active filer today.</p>
            <p className="text-xs text-slate-400">Akbar Tax Store — certified tax filing assistance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={waURL} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "withholding-tax", location: "footer" })} className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">WhatsApp Us</a>
            <Link href="/personal/tax-return" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">Tax Return Filing</Link>
            <Link href="/personal/filer" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">Filer Status</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
