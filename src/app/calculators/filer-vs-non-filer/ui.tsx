"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPKR, parseInputNumber, withCommas } from "@/lib/taxData";

const DISCLAIMER =
  "Disclaimer: This calculator provides estimates based on Finance Act 2025 (FY 2025-26) tax slabs published by the Federal Board of Revenue (FBR). Results are for guidance purposes only. Your actual tax liability may differ based on specific deductions, exemptions, allowances, and other factors applicable to your individual circumstances. Always consult a certified tax advisor or contact Akbar Tax Store for a personalized assessment.";

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

export default function FilerVsNonFilerClient() {
  const [cashWithdrawals, setCashWithdrawals] = useState("0");
  const [propertyValue, setPropertyValue] = useState("0");
  const [transactionType, setTransactionType] = useState("none");
  const [dividendIncome, setDividendIncome] = useState("0");
  const [bankProfit, setBankProfit] = useState("0");
  const [annualIncome, setAnnualIncome] = useState("0");

  const result = useMemo(() => {
    const cash = parseInputNumber(cashWithdrawals);
    const property = parseInputNumber(propertyValue);
    const dividend = parseInputNumber(dividendIncome);
    const profit = parseInputNumber(bankProfit);

    const bankWithdrawalSaved = cash * 0.006;
    const propertyBuySaved = transactionType === "buy" || transactionType === "both" ? property * 0.09 : 0;
    const propertySellSaved = transactionType === "sell" || transactionType === "both" ? property * 0.07 : 0;
    const dividendSaved = dividend * 0.1;
    const bankProfitSaved = profit * 0.2;
    const total = bankWithdrawalSaved + propertyBuySaved + propertySellSaved + dividendSaved + bankProfitSaved;
    return { bankWithdrawalSaved, propertyBuySaved, propertySellSaved, dividendSaved, bankProfitSaved, total };
  }, [cashWithdrawals, propertyValue, transactionType, dividendIncome, bankProfit]);

  const daysToRecoverFee = result.total > 0 ? Math.max(1, Math.round(9000 / (result.total / 365))) : 0;
  const waURL = `https://wa.me/923407300408?text=${encodeURIComponent(
    `Hi, I used your Filer vs Non-Filer calculator. Estimated annual savings PKR ${Math.round(result.total)}. Help me become a filer.`,
  )}`;

  useEffect(() => {
    track("result_viewed", { calculator: "filer-vs-non-filer", savings: Math.round(result.total) });
  }, [result.total]);

  const savingsRows = [
    { label: "Cash Withdrawal (Sec 231AB)", value: result.bankWithdrawalSaved },
    { label: "Property Purchase (Sec 236K)", value: result.propertyBuySaved },
    { label: "Property Sale (Sec 236C)", value: result.propertySellSaved },
    { label: "Dividend Income (Sec 150)", value: result.dividendSaved },
    { label: "Bank Profit (Sec 151)", value: result.bankProfitSaved },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Filer vs Non-Filer Savings Calculator Pakistan 2025</h1>
        <p className="mt-1 text-sm text-slate-500">
          Finance Act 2025 · Non-filers can no longer buy property or vehicles under current policy restrictions
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: Inputs + Savings Table */}
        <div className="space-y-6">
          {/* Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-sm">📊</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Your Financial Activity</h2>
                <p className="text-xs text-slate-400">Enter your expected annual transactions to see your savings</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Annual Salary / Income (PKR)"
                hint="Your total annual income from all sources"
                value={annualIncome}
                onChange={(v) => { setAnnualIncome(v); track("calculator_used", { calculator: "filer-vs-non-filer", field: "annual_income" }); }}
                icon={<span className="text-xs">💼</span>}
              />
              <InputField
                label="Annual Bank Withdrawals (PKR)"
                hint="Total cash withdrawn above PKR 50,000/day"
                value={cashWithdrawals}
                onChange={(v) => { setCashWithdrawals(v); track("calculator_used", { calculator: "filer-vs-non-filer", field: "cash_withdrawals" }); }}
                icon={<span className="text-xs">🏧</span>}
              />
              <InputField
                label="Property Value (PKR)"
                hint="Value of property you plan to buy or sell"
                value={propertyValue}
                onChange={(v) => { setPropertyValue(v); track("calculator_used", { calculator: "filer-vs-non-filer", field: "property_value" }); }}
                icon={<span className="text-xs">🏠</span>}
              />
              <CustomDropdown
                label="Transaction Type (Property)"
                hint="Whether you are buying, selling, or both"
                value={transactionType}
                onChange={setTransactionType}
                icon={<span className="text-xs">🔑</span>}
                options={[
                  { value: "none", label: "None" },
                  { value: "buy", label: "Buy" },
                  { value: "sell", label: "Sell" },
                  { value: "both", label: "Both (Buy & Sell)" },
                ]}
              />
              <InputField
                label="Annual Dividend Income (PKR)"
                hint="Dividends received from stocks or mutual funds"
                value={dividendIncome}
                onChange={(v) => { setDividendIncome(v); track("calculator_used", { calculator: "filer-vs-non-filer", field: "dividend_income" }); }}
                icon={<span className="text-xs">📈</span>}
              />
              <InputField
                label="Annual Bank Profit / Interest (PKR)"
                hint="Profit on savings, fixed deposits, or term accounts"
                value={bankProfit}
                onChange={(v) => { setBankProfit(v); track("calculator_used", { calculator: "filer-vs-non-filer", field: "bank_profit" }); }}
                icon={<span className="text-xs">🏦</span>}
              />
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Savings by transaction type</h2>
                <p className="text-xs text-slate-400">How much less WHT you pay as a filer on each transaction</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 p-2.5 text-left text-xs font-semibold text-slate-600">Transaction</th>
                    <th className="border border-slate-200 p-2.5 text-right text-xs font-semibold text-slate-600">Annual Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {savingsRows.map((row, i) => (
                    <tr key={i} className={row.value > 0 ? "bg-emerald-50" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="border border-slate-200 p-2.5 text-slate-700">{row.label}</td>
                      <td className={`border border-slate-200 p-2.5 text-right font-semibold ${row.value > 0 ? "text-emerald-700" : "text-slate-400"}`}>
                        {row.value > 0 ? formatPKR(row.value) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="px-5 pt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Annual Savings as Filer</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-emerald-400">{formatPKR(result.total)}</p>
                <p className="mt-1 text-xs text-slate-400">per year by being on the Active Taxpayer List</p>
              </div>

              {result.total > 10000 && (
                <div className="mx-5 mt-5 rounded-xl bg-emerald-900/40 px-4 py-2.5 text-xs text-emerald-300">
                  ✓ Your Akbar Tax Store filing fee pays for itself in {daysToRecoverFee} days.
                </div>
              )}

              <div className="mt-5 border-t border-slate-700 p-5">
                <a
                  href={waURL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp_clicked", { calculator: "filer-vs-non-filer" })}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Become a Filer in 24 Hours — PKR 9,000
                </a>
                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">{DISCLAIMER}</p>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-600">Start saving today.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/personal/ntn" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">NTN Registration</Link>
                <Link href="/personal/tax-return" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">FBR Tax Return</Link>
                <Link href="/personal/filer" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Filer Status</Link>
                <Link href="/contact" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide / FAQ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Filer vs Non-Filer in Pakistan 2025-26 — complete guide</h2>
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What is the Difference Between a Filer and Non-Filer in Pakistan?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Filers are active taxpayers who submit annual returns and appear on the Active Taxpayer List. Non-filers face significantly higher withholding rates and practical restrictions in financial and asset transactions.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Non-Filer Penalties in Pakistan 2025-26 — Complete List</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Key penalties include higher tax on property purchase/sale, dividends, banking profits, and cash withdrawals. Current policy also limits non-filer access to property and vehicle purchase pathways.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">How to Check Your FBR Filer Status — SMS 9966</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Send your CNIC number (without dashes) to 9966 via SMS to check your ATL status instantly. You can also check at FBR&apos;s IRIS portal online.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">How to Become an Active Taxpayer in Pakistan — Step by Step</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Register your NTN, file your income tax return for the relevant tax year, and your name will appear on the Active Taxpayer List within 24–48 hours. Akbar Tax Store handles the entire process for PKR 9,000.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-sm font-semibold">File Now for PKR 9,000 — Become Active in 24 Hours</p>
            <p className="text-xs text-slate-400">Akbar Tax Store — certified tax filing assistance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={waURL} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "filer-vs-non-filer", location: "footer" })} className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">WhatsApp Us</a>
            <Link href="/personal/ntn" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">NTN Registration</Link>
            <Link href="/personal/filer" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">Filer Status</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
