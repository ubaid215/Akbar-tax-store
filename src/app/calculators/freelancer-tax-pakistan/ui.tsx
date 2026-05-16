"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BUSINESS_SLABS, calculateSlabTax, formatPKR, parseInputNumber, withCommas } from "@/lib/taxData";

function InputField({
  label, hint, value, onChange, icon, prefix = "₨",
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void; icon: React.ReactNode; prefix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
        {icon}{label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">{prefix}</span>
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

export default function FreelancerTaxClient() {
  const [platform, setPlatform] = useState("Upwork");
  const [usdIncome, setUsdIncome] = useState("10,000");
  const [rate, setRate] = useState("280");
  const [psebRegistered, setPsebRegistered] = useState("Yes");
  const [localIncome, setLocalIncome] = useState("0");
  const [expenses, setExpenses] = useState("0");
  const [zakat, setZakat] = useState("0");

  const result = useMemo(() => {
    const usd = parseInputNumber(usdIncome);
    const fx = parseInputNumber(rate) || 280;
    const pkrFromUsd = usd * fx;
    const local = parseInputNumber(localIncome);
    const exp = parseInputNumber(expenses);
    const z = parseInputNumber(zakat);
    const gross = pkrFromUsd + local;
    const taxable = Math.max(0, gross - exp - z);
    const slabTax = calculateSlabTax(taxable, BUSINESS_SLABS).tax;
    const turnoverMin = gross * 0.01;
    const nonPsebTax = Math.max(slabTax, turnoverMin);
    const psebTax = pkrFromUsd * 0.0025;
    return { pkrFromUsd, gross, taxable, psebTax, nonPsebTax, savings: Math.max(0, nonPsebTax - psebTax) };
  }, [usdIncome, rate, localIncome, expenses, zakat]);

  useEffect(() => {
    track("result_viewed", { calculator: "freelancer-tax", tax_non_pseb: Math.round(result.nonPsebTax) });
  }, [result.nonPsebTax]);

  const waURL = `https://wa.me/923407300408?text=${encodeURIComponent(
    `Hi, I used your Freelancer Tax Calculator. PSEB tax ${Math.round(result.psebTax)} and Non-PSEB tax ${Math.round(result.nonPsebTax)}. Please help me file return.`,
  )}`;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Freelancer Tax Calculator Pakistan 2025-26</h1>
        <p className="mt-1 text-sm text-slate-500">Finance Act 2025 · PSEB vs Non-PSEB tax comparison · FBR rules</p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          {/* Income Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Income Details</h2>
                <p className="text-xs text-slate-400">Your freelance income in USD and any local PKR income</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomDropdown
                label="Freelance Platform"
                hint="Where you earn your freelance income"
                value={platform}
                onChange={setPlatform}
                icon={<span className="text-xs">🌐</span>}
                options={[
                  { value: "Upwork", label: "Upwork" },
                  { value: "Fiverr", label: "Fiverr" },
                  { value: "Toptal", label: "Toptal" },
                  { value: "Direct Client", label: "Direct Client" },
                  { value: "Other", label: "Other" },
                ]}
              />
              <InputField
                label="Annual Freelance Income (USD)"
                hint="Your total USD earnings for the year"
                value={usdIncome}
                onChange={(v) => { setUsdIncome(v); track("calculator_used", { calculator: "freelancer-tax", field: "usd_income" }); }}
                icon={<span className="text-xs">💵</span>}
                prefix="$"
              />
              <InputField
                label="USD to PKR Exchange Rate"
                hint="Current or average exchange rate for the year"
                value={rate}
                onChange={setRate}
                icon={<span className="text-xs">🔁</span>}
                prefix="₨"
              />
              <InputField
                label="Any Local (PKR) Freelance Income"
                hint="Income earned from Pakistani clients in PKR"
                value={localIncome}
                onChange={setLocalIncome}
                icon={<span className="text-xs">🏠</span>}
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
              <span className="text-xs font-medium text-blue-600">Gross annual income (PKR)</span>
              <span className="text-sm font-bold text-blue-800">{formatPKR(result.gross)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                <span className="text-sm">🛡️</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Deductions</h2>
                <p className="text-xs text-slate-400">Business expenses and charitable donations reduce taxable income</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Business Expenses (PKR)"
                hint="Software, hardware, internet, office costs, etc."
                value={expenses}
                onChange={setExpenses}
                icon={<span className="text-xs">🖥️</span>}
              />
              <InputField
                label="Zakat / Charitable Donation (PKR)"
                hint="Fully deducted from taxable income — no upper limit"
                value={zakat}
                onChange={setZakat}
                icon={<span className="text-xs">🤲</span>}
              />
            </div>
            {(parseInputNumber(expenses) > 0 || parseInputNumber(zakat) > 0) && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-xs font-medium text-emerald-600">Total deductions</span>
                <span className="text-sm font-bold text-emerald-800">− {formatPKR(parseInputNumber(expenses) + parseInputNumber(zakat))}</span>
              </div>
            )}
          </div>

          {/* PSEB */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100">
                <span className="text-sm">🏛️</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">PSEB Registration</h2>
                <p className="text-xs text-slate-400">PSEB-registered IT exporters pay just 0.25% final tax on export proceeds</p>
              </div>
            </div>
            <CustomDropdown
              label="Are you PSEB Registered?"
              hint="PSEB registration is free — contact us to help you apply"
              value={psebRegistered}
              onChange={setPsebRegistered}
              icon={<span className="text-xs">✅</span>}
              options={[
                { value: "Yes", label: "Yes — PSEB registered" },
                { value: "No", label: "No — not registered yet" },
              ]}
            />
            {result.savings > 20000 && (
              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-medium text-emerald-700">
                  PSEB registration is free — you could save {formatPKR(result.savings)} annually. Contact Akbar Tax Store to assist.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="px-5 pt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">PSEB Tax Savings</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-emerald-400">{formatPKR(result.savings)}</p>
                <p className="mt-1 text-xs text-slate-400">by registering with PSEB vs non-PSEB path</p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-slate-700">
                <div className="border-r border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">PSEB Tax (0.25%)</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-400">{formatPKR(result.psebTax)}</p>
                  <p className="text-[10px] text-slate-500">final tax on exports</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Non-PSEB Tax</p>
                  <p className="mt-1 text-lg font-semibold text-red-400">{formatPKR(result.nonPsebTax)}</p>
                  <p className="text-[10px] text-slate-500">slab or turnover tax</p>
                </div>
                <div className="border-r border-t border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">USD in PKR</p>
                  <p className="mt-1 text-lg font-semibold">{formatPKR(result.pkrFromUsd)}</p>
                  <p className="text-[10px] text-slate-500">at entered rate</p>
                </div>
                <div className="border-t border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Taxable Income</p>
                  <p className="mt-1 text-lg font-semibold">{formatPKR(result.taxable)}</p>
                  <p className="text-[10px] text-slate-500">after deductions</p>
                </div>
              </div>
              <div className="border-t border-slate-700 p-5">
                <a
                  href={waURL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp_clicked", { calculator: "freelancer-tax" })}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get Freelancer Filing Help
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-600">Need to file? We handle it end-to-end.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/personal/tax-return" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">FBR Tax Return</Link>
                <Link href="/personal/ntn" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">NTN Registration</Link>
                <Link href="/personal/gst" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">GST / PRA Help</Link>
                <Link href="/contact" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide / FAQ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Pakistan freelancer tax guide 2025-26</h2>
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">How is Freelance Income Taxed in Pakistan?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Freelancers are usually treated under non-salaried tax rules unless a specific export final tax regime applies. Income from all platforms is taxable and FBR return filing is required.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What is PSEB Registration and How Does it Reduce Tax?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">PSEB-registered IT exporters can access final tax treatment at 0.25% on export proceeds, which can be significantly lower than slab tax. PSEB registration is free and Akbar Tax Store can assist you.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Do Upwork and Fiverr Freelancers Pay Tax in Pakistan?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Yes. Income from international freelance platforms is taxable and return filing is still required under FBR framework, regardless of which platform you use.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">How to File Tax Return as a Freelancer in Pakistan — Step by Step</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Register your NTN, declare your foreign income and exchange rate, claim allowable deductions (expenses, zakat/charitable donations), and choose the correct tax regime (PSEB or normal). Akbar Tax Store handles the entire process.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Pakistan Freelancer Tax Rate 2025-26 — Official FBR Rules</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Non-PSEB freelancers pay slab tax or minimum turnover tax (1% of gross receipts), whichever is higher. PSEB IT exporters pay a flat final tax of 0.25% on export proceeds under Sec 154.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-sm font-semibold">Not sure how to file as a freelancer? We handle it.</p>
            <p className="text-xs text-slate-400">Akbar Tax Store — certified tax filing assistance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={waURL} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "freelancer-tax", location: "footer" })} className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">WhatsApp Us</a>
            <Link href="/personal/tax-return" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">Tax Return Filing</Link>
            <Link href="/personal/ntn" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">NTN Registration</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
