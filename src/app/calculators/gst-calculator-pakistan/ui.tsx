"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPKR, parseInputNumber, withCommas } from "@/lib/taxData";

const serviceRateByProvince: Record<string, number> = {
  Punjab: 0.16,
  Sindh: 0.15,
  KPK: 0.15,
  Balochistan: 0.15,
  ICT: 0.15,
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

export default function GSTCalculatorClient() {
  const [amount, setAmount] = useState("100,000");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [type, setType] = useState("Goods");
  const [province, setProvince] = useState("Punjab");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const { rate, authority } = useMemo(() => {
    if (type === "Goods" || type === "Import") return { rate: 0.18, authority: "FBR" };
    if (type === "Digital/E-Commerce") return { rate: 0.2, authority: "FBR" };
    if (type === "Services") return {
      rate: serviceRateByProvince[province],
      authority: province === "Punjab" ? "PRA" : province === "Sindh" ? "SRB" : province === "KPK" ? "KPRA" : province === "Balochistan" ? "BRA" : "FBR (ICT)",
    };
    if (type === "Restaurant" && province === "Sindh" && paymentMethod === "Digital") return { rate: 0.08, authority: "SRB Sindh" };
    return { rate: 0.15, authority: "Provincial Authority" };
  }, [type, province, paymentMethod]);

  const calc = useMemo(() => {
    const val = parseInputNumber(amount);
    if (mode === "exclusive") {
      const tax = val * rate;
      return { preTax: val, tax, total: val + tax };
    }
    const preTax = val / (1 + rate);
    const tax = val - preTax;
    return { preTax, tax, total: val };
  }, [amount, mode, rate]);

  useEffect(() => {
    track("result_viewed", { calculator: "gst", tax_amount: Math.round(calc.tax) });
  }, [calc.tax]);

  const waURL = `https://wa.me/923407300408?text=${encodeURIComponent(`Hi, I used your GST calculator and got tax ${Math.round(calc.tax)} PKR. Please guide GST registration.`)}`;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">GST Calculator Pakistan 2025</h1>
        <p className="mt-1 text-sm text-slate-500">Finance Act 2025 · FBR &amp; Provincial Sales Tax rates</p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          {/* Transaction Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-sm">🧾</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Transaction Details</h2>
                <p className="text-xs text-slate-400">Enter your amount and select the transaction type</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Amount (PKR)"
                hint="Enter the transaction amount"
                value={amount}
                onChange={(v) => { setAmount(v); track("calculator_used", { calculator: "gst", field: "amount" }); }}
                icon={<span className="text-xs">💰</span>}
              />
              <CustomDropdown
                label="Transaction Type"
                hint="Goods, Services, Restaurant, Digital, or Import"
                value={type}
                onChange={setType}
                icon={<span className="text-xs">📦</span>}
                options={[
                  { value: "Goods", label: "Goods" },
                  { value: "Services", label: "Services" },
                  { value: "Restaurant", label: "Restaurant" },
                  { value: "Digital/E-Commerce", label: "Digital / E-Commerce" },
                  { value: "Import", label: "Import" },
                ]}
              />
              <CustomDropdown
                label="Mode"
                hint="Whether tax is already included in your amount"
                value={mode}
                onChange={(v) => setMode(v as "exclusive" | "inclusive")}
                icon={<span className="text-xs">🔄</span>}
                options={[
                  { value: "exclusive", label: "Tax already excluded" },
                  { value: "inclusive", label: "Tax already included" },
                ]}
              />
              {(type === "Services" || type === "Restaurant") && (
                <CustomDropdown
                  label="Province"
                  hint="Tax authority and rate varies by province"
                  value={province}
                  onChange={setProvince}
                  icon={<span className="text-xs">📍</span>}
                  options={[
                    { value: "Punjab", label: "Punjab (PRA)" },
                    { value: "Sindh", label: "Sindh (SRB)" },
                    { value: "KPK", label: "KPK (KPRA)" },
                    { value: "Balochistan", label: "Balochistan (BRA)" },
                    { value: "ICT", label: "ICT / Federal (FBR)" },
                  ]}
                />
              )}
              {type === "Restaurant" && province === "Sindh" && (
                <CustomDropdown
                  label="Payment Method"
                  hint="Sindh restaurant tax rate differs by payment type"
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  icon={<span className="text-xs">💳</span>}
                  options={[
                    { value: "Digital", label: "Digital (Card / Mobile)" },
                    { value: "Cash", label: "Cash" },
                  ]}
                />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
              <span className="text-xs font-medium text-blue-600">Applied rate · {authority}</span>
              <span className="text-sm font-bold text-blue-800">{(rate * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                <span className="text-sm">🧮</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">How GST is calculated</h2>
                <p className="text-xs text-slate-400">Step-by-step breakdown</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-blue-700">Pre-tax Amount</p>
                  <p className="text-[11px] text-blue-500 opacity-70">{mode === "inclusive" ? "Extracted from entered total" : "Your entered amount"}</p>
                </div>
                <span className="text-sm font-bold text-blue-700">{formatPKR(calc.preTax)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-orange-700">+ GST / Tax Amount</p>
                  <p className="text-[11px] text-orange-500 opacity-70">Pre-tax × {(rate * 100).toFixed(2)}% ({authority})</p>
                </div>
                <span className="text-sm font-bold text-orange-700">{formatPKR(calc.tax)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-white">
                <p className="text-sm font-medium">= Total Amount</p>
                <span className="text-sm font-bold">{formatPKR(calc.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="px-5 pt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">GST / Tax Amount</p>
                <p className="mt-1 text-4xl font-bold tracking-tight">{formatPKR(calc.tax)}</p>
                <p className="mt-1 text-xs text-slate-400">{(rate * 100).toFixed(2)}% · {authority}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-slate-700">
                <div className="border-r border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Pre-tax Amount</p>
                  <p className="mt-1 text-lg font-semibold">{formatPKR(calc.preTax)}</p>
                  <p className="text-[10px] text-slate-500">before tax</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Total Amount</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-400">{formatPKR(calc.total)}</p>
                  <p className="text-[10px] text-slate-500">including tax</p>
                </div>
              </div>
              {calc.tax > 300000 && (
                <div className="mx-5 mb-5 mt-0 rounded-xl bg-amber-900/40 px-4 py-2.5 text-xs text-amber-300">
                  ⚠ You may need GST Registration (Sec 236G). Akbar Tax Store handles this for PKR 40,000.
                </div>
              )}
              <div className="border-t border-slate-700 p-5">
                <a
                  href={waURL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp_clicked", { calculator: "gst" })}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get GST Help on WhatsApp
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-600">Need GST registration? We can help.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/personal/gst" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">GST Registration</Link>
                <Link href="/business/gst" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Business GST</Link>
                <Link href="/personal/tax-return" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">FBR Tax Return</Link>
                <Link href="/contact" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide / FAQ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Pakistan GST / Sales Tax guide 2025</h2>
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What is GST Rate in Pakistan 2025?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Federal GST is 18% on goods, while services are usually 15–16% depending on provincial authority. Digital/e-commerce transactions attract 20% under FBR rules.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Do I Need to Register for GST in Pakistan?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">A common threshold is annual turnover above PKR 10 million, though specific sectors may trigger registration earlier. Failing to register when required can result in penalties.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">GST vs PRA vs SRB — What&apos;s the Difference?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">FBR generally handles goods and federal scope, while PRA (Punjab), SRB (Sindh), KPRA (KPK), and BRA (Balochistan) manage services in their respective provinces.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">How to File GST Return in Pakistan — FBR IRIS Portal</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">GST returns are filed monthly through FBR&apos;s IRIS portal. You&apos;ll need to reconcile sales, purchases, and input tax credits. Akbar Tax Store handles end-to-end GST return filing.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-sm font-semibold">Need GST registration or return filing?</p>
            <p className="text-xs text-slate-400">Akbar Tax Store — certified tax filing assistance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={waURL} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "gst", location: "footer" })} className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">WhatsApp Us</a>
            <Link href="/personal/gst" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">GST Registration</Link>
            <Link href="/personal/ntn" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">NTN Registration</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
