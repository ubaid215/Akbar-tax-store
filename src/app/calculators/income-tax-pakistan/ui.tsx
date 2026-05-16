"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  SALARIED_SLABS,
  calculateIncomeTax,
  formatNumber,
  formatPKR,
  parseInputNumber,
  withCommas,
} from "@/lib/taxData";

const DISCLAIMER =
  "Disclaimer: This calculator provides estimates based on Finance Act 2025 (FY 2025-26) tax slabs published by the Federal Board of Revenue (FBR). Results are for guidance purposes only. Your actual tax liability may differ based on specific deductions, exemptions, allowances, and other factors applicable to your individual circumstances. Always consult a certified tax advisor or contact Akbar Tax Store for a personalized assessment.";

function InputField({
  label,
  hint,
  value,
  onChange,
  icon,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
        {icon}
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          ₨
        </span>
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

function SlabBar({
  slabs,
  taxableIncome,
  activeSlab,
}: {
  slabs: typeof SALARIED_SLABS;
  taxableIncome: number;
  activeSlab: (typeof SALARIED_SLABS)[0];
}) {
  const colors = [
    "bg-emerald-400",
    "bg-cyan-400",
    "bg-blue-400",
    "bg-violet-400",
    "bg-orange-400",
    "bg-rose-400",
    "bg-red-500",
  ];
  const totalRange = (slabs[slabs.length - 1].max ?? taxableIncome * 1.2) || 5000000;

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {slabs.map((slab, i) => {
          const upper = slab.max ?? totalRange;
          const width = ((upper - slab.min) / totalRange) * 100;
          const filled = taxableIncome > slab.min;
          return (
            <div
              key={slab.label}
              style={{ width: `${width}%` }}
              className={`h-full transition-all ${filled ? colors[i] : "bg-slate-100"} border-r border-white`}
              title={`${slab.label} slab`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>0</span>
        <span>Your income: {formatPKR(taxableIncome)}</span>
        <span>{slabs[slabs.length - 1].max ? formatPKR(slabs[slabs.length - 1].max!) : "Above"}</span>
      </div>
    </div>
  );
}

function BreakdownStep({
  step,
  label,
  value,
  sub,
  type,
}: {
  step: number;
  label: string;
  value: string;
  sub?: string;
  type: "income" | "deduct" | "tax" | "result";
}) {
  const colors: Record<string, string> = {
    income: "bg-blue-50 border-blue-200 text-blue-700",
    deduct: "bg-emerald-50 border-emerald-200 text-emerald-700",
    tax: "bg-orange-50 border-orange-200 text-orange-700",
    result: "bg-slate-900 border-slate-900 text-white",
  };
  const stepColors: Record<string, string> = {
    income: "bg-blue-100 text-blue-700",
    deduct: "bg-emerald-100 text-emerald-700",
    tax: "bg-orange-100 text-orange-700",
    result: "bg-white/20 text-white",
  };

  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${stepColors[type]}`}>
          {step}
        </span>
        <div>
          <p className="text-sm font-medium">{label}</p>
          {sub && <p className="text-[11px] opacity-70">{sub}</p>}
        </div>
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

const track = (event: string, params: Record<string, string | number> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
};

export default function IncomeTaxCalculatorClient() {
  const [monthlySalary, setMonthlySalary] = useState("100,000");
  const [annualBonus, setAnnualBonus] = useState("0");
  const [zakatPaid, setZakatPaid] = useState("0");
  const [hasMedicalAllowance, setHasMedicalAllowance] = useState(false);

  const result = useMemo(
    () =>
      calculateIncomeTax({
        monthlySalary: parseInputNumber(monthlySalary),
        annualBonus: parseInputNumber(annualBonus),
        zakatPaid: parseInputNumber(zakatPaid),
        incomeType: "salaried",
        hasMedicalAllowance,
      }),
    [monthlySalary, annualBonus, zakatPaid, hasMedicalAllowance],
  );

  const waMessage = `Hi, I used your Income Tax Calculator and got: Annual Tax PKR ${Math.round(result.annualTax)}. I need help filing.`;
  const waURL = `https://wa.me/923407300408?text=${encodeURIComponent(waMessage)}`;
  const slabs = SALARIED_SLABS;

  useEffect(() => {
    track("result_viewed", { calculator: "income-tax", annual_tax: Math.round(result.annualTax) });
  }, [result.annualTax]);

  const slabColors = [
    { bar: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-200" },
    { bar: "bg-cyan-400", badge: "bg-cyan-100 text-cyan-700", border: "border-cyan-200" },
    { bar: "bg-blue-400", badge: "bg-blue-100 text-blue-700", border: "border-blue-200" },
    { bar: "bg-violet-400", badge: "bg-violet-100 text-violet-700", border: "border-violet-200" },
    { bar: "bg-orange-400", badge: "bg-orange-100 text-orange-700", border: "border-orange-200" },
    { bar: "bg-rose-400", badge: "bg-rose-100 text-rose-700", border: "border-rose-200" },
    { bar: "bg-red-500", badge: "bg-red-100 text-red-700", border: "border-red-200" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is the salary tax rate in Pakistan for 2025-26?", acceptedAnswer: { "@type": "Answer", text: "Salaried rates start from 0% and go up to 35% under Finance Act 2025, plus 9% surcharge for income above PKR 10 million." } },
              { "@type": "Question", name: "How is income tax calculated in Pakistan?", acceptedAnswer: { "@type": "Answer", text: "Annual income is adjusted for allowable deductions (medical allowance, zakat / charitable donations), then progressive FBR slabs are applied. Tax = fixed component + (taxable income - slab floor) × slab rate." } },
              { "@type": "Question", name: "What is the FBR return deadline for Tax Year 2026?", acceptedAnswer: { "@type": "Answer", text: "The filing deadline for Tax Year 2026 is September 30, 2026 unless extended by FBR." } },
              { "@type": "Question", name: "Does zakat or charitable donation reduce taxable income?", acceptedAnswer: { "@type": "Answer", text: "Yes, zakat and charitable donations are fully deducted from taxable income with no cap in this calculator." } },
              { "@type": "Question", name: "What is the medical allowance exemption?", acceptedAnswer: { "@type": "Answer", text: "Medical allowance is exempt up to 10% of basic salary or PKR 25,000 per year, whichever is lower." } },
            ],
          }),
        }}
      />

      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pakistan Income Tax Calculator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Finance Act 2025 · FY July 2025 – June 2026 · FBR progressive slabs
        </p>
      </div>

      {/* Two-column layout: Inputs + Results */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          {/* Income Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Income</h2>
                <p className="text-xs text-slate-400">What you earn before any deductions</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Monthly Gross Salary"
                hint="Your total monthly pay before any deductions"
                value={monthlySalary}
                onChange={(v) => {
                  setMonthlySalary(v);
                  track("calculator_used", { calculator: "income-tax", field: "monthly_salary" });
                }}
                icon={<span className="text-xs">📅</span>}
              />
              <InputField
                label="Annual Bonus / Extra Income"
                hint="One-time bonus, commission, or any other annual income"
                value={annualBonus}
                onChange={(v) => {
                  setAnnualBonus(v);
                  track("calculator_used", { calculator: "income-tax", field: "annual_bonus" });
                }}
                icon={<span className="text-xs">🎁</span>}
              />
            </div>

            {/* Annual income preview */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
              <span className="text-xs font-medium text-blue-600">Gross annual income</span>
              <span className="text-sm font-bold text-blue-800">{formatPKR(result.annualIncome)}</span>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                <span className="text-sm">🛡️</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Deductions</h2>
                <p className="text-xs text-slate-400">These reduce your taxable income and lower your tax</p>
              </div>
            </div>

            {/* Medical Allowance Toggle */}
            <div className="mb-4 rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Medical allowance included in salary?</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    If your salary package includes a medical component, it&apos;s exempt up to{" "}
                    <strong>10% of basic salary</strong> or <strong>PKR 25,000/year</strong> — whichever is lower.
                  </p>
                  {hasMedicalAllowance && result.medicalExemption > 0 && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                      ✓ Exemption applied: {formatPKR(result.medicalExemption)} deducted from income
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setHasMedicalAllowance(!hasMedicalAllowance);
                    track("calculator_used", { calculator: "income-tax", field: "medical_allowance" });
                  }}
                  className={`relative mt-0.5 h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    hasMedicalAllowance ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      hasMedicalAllowance ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Zakat / Charitable Donation */}
            <InputField
              label="Zakat / Charitable Donation This Year"
              hint="Fully deducted from taxable income — no upper limit applies"
              value={zakatPaid}
              onChange={(v) => {
                setZakatPaid(v);
                track("calculator_used", { calculator: "income-tax", field: "zakat" });
              }}
              icon={<span className="text-xs">🤲</span>}
            />

            {/* Total deductions preview */}
            {(result.medicalExemption > 0 || parseInputNumber(zakatPaid) > 0) && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-xs font-medium text-emerald-600">Total deductions</span>
                <span className="text-sm font-bold text-emerald-800">
                  − {formatPKR(result.medicalExemption + parseInputNumber(zakatPaid))}
                </span>
              </div>
            )}
          </div>

          {/* How tax is calculated — step-by-step */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                <span className="text-sm">🧮</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">How your tax is calculated</h2>
                <p className="text-xs text-slate-400">Step-by-step breakdown of every number</p>
              </div>
            </div>
            <div className="space-y-2">
              <BreakdownStep
                step={1}
                label="Monthly salary × 12"
                sub={`${formatPKR(parseInputNumber(monthlySalary))} × 12`}
                value={formatPKR(parseInputNumber(monthlySalary) * 12)}
                type="income"
              />
              {parseInputNumber(annualBonus) > 0 && (
                <BreakdownStep
                  step={2}
                  label="+ Annual bonus / extra income"
                  sub="Added to gross income"
                  value={`+ ${formatPKR(parseInputNumber(annualBonus))}`}
                  type="income"
                />
              )}
              <BreakdownStep
                step={3}
                label="= Gross annual income"
                value={formatPKR(result.annualIncome)}
                type="income"
              />
              {result.medicalExemption > 0 && (
                <BreakdownStep
                  step={4}
                  label="− Medical allowance exemption"
                  sub={`10% of annual salary or PKR 25,000 max`}
                  value={`− ${formatPKR(result.medicalExemption)}`}
                  type="deduct"
                />
              )}
              {parseInputNumber(zakatPaid) > 0 && (
                <BreakdownStep
                  step={5}
                  label="− Zakat / Charitable Donation"
                  sub="No cap — full amount deducted"
                  value={`− ${formatPKR(parseInputNumber(zakatPaid))}`}
                  type="deduct"
                />
              )}
              <BreakdownStep
                step={6}
                label="= Taxable income"
                sub="Progressive FBR slabs applied on this amount"
                value={formatPKR(result.taxableIncome)}
                type="deduct"
              />
              <BreakdownStep
                step={7}
                label={`Slab tax (${result.marginalSlab.label} marginal slab)`}
                sub={`Fixed: ${formatPKR(result.marginalSlab.fixed)} + (taxable − ${formatPKR(result.marginalSlab.min)}) × ${result.marginalSlab.rate * 100}%`}
                value={formatPKR(result.annualTax - result.surcharge)}
                type="tax"
              />
              {result.surcharge > 0 && (
                <BreakdownStep
                  step={8}
                  label="+ Surcharge (9% on tax)"
                  sub="Applied because income exceeds PKR 10 million"
                  value={`+ ${formatPKR(result.surcharge)}`}
                  type="tax"
                />
              )}
              <BreakdownStep
                step={result.surcharge > 0 ? 9 : 8}
                label="= Annual tax payable"
                value={formatPKR(result.annualTax)}
                type="result"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Results Panel */}
        <div className="space-y-4">
          {/* Main Result Card */}
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="px-5 pt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Annual Tax Payable
                </p>
                <p className="mt-1 text-4xl font-bold tracking-tight">
                  {formatPKR(result.annualTax)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Effective rate: {result.effectiveRate.toFixed(2)}% of gross income
                </p>
              </div>

              {/* Metrics grid */}
              <div className="mt-5 grid grid-cols-2 border-t border-slate-700">
                <div className="border-r border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Monthly Tax</p>
                  <p className="mt-1 text-lg font-semibold">{formatPKR(result.monthlyTax)}</p>
                  <p className="text-[10px] text-slate-500">deducted by employer</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Monthly Salary</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-400">
                    {formatPKR(result.takeHomeMonthly)}
                  </p>
                  <p className="text-[10px] text-slate-500">per month after tax</p>
                </div>
                <div className="border-r border-t border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Marginal Slab</p>
                  <p className="mt-1 text-lg font-semibold text-orange-400">
                    {result.marginalSlab.label}
                  </p>
                  <p className="text-[10px] text-slate-500">on income above {formatPKR(result.marginalSlab.min)}</p>
                </div>
                <div className="border-t border-slate-700 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Annual Income</p>
                  <p className="mt-1 text-lg font-semibold">{formatPKR(result.taxableIncome)}</p>
                  <p className="text-[10px] text-slate-500">after all deductions</p>
                </div>
              </div>

              {result.surcharge > 0 && (
                <div className="mx-5 mb-5 mt-0 rounded-xl bg-amber-900/40 px-4 py-2.5 text-xs text-amber-300">
                  ⚠ Surcharge of 9% applied on tax ({formatPKR(result.surcharge)}) — income exceeds PKR 10 million.
                </div>
              )}

              {/* WhatsApp CTA */}
              <div className="border-t border-slate-700 p-5">
                <a
                  href={waURL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp_clicked", { calculator: "income-tax" })}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get Help Filing on WhatsApp
                </a>
              </div>
            </div>

            {/* Slab breakdown card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Salaried tax slabs — your position
              </h3>

              {/* Visual bar */}
              <div className="mb-4 space-y-1.5">
                <div className="flex h-2 w-full overflow-hidden rounded-full">
                  {slabs.map((slab, i) => {
                    const totalMax = slabs[slabs.length - 1].max ?? Math.max(result.taxableIncome * 1.2, 5000000);
                    const slabMax = slab.max ?? totalMax;
                    const pct = ((slabMax - slab.min) / totalMax) * 100;
                    const active = result.taxableIncome > slab.min;
                    const isCurrent = slab.min === result.marginalSlab.min;
                    return (
                      <div
                        key={i}
                        style={{ width: `${pct}%` }}
                        className={`h-full border-r border-white transition-all ${
                          isCurrent
                            ? slabColors[i].bar + " ring-1 ring-slate-900 ring-offset-1"
                            : active
                            ? slabColors[i].bar
                            : "bg-slate-100"
                        }`}
                        title={`${slab.label}: ${formatPKR(slab.min)} – ${slab.max ? formatPKR(slab.max) : "above"}`}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400">
                  Highlighted = your income falls in this slab range · Darker outline = your marginal slab
                </p>
              </div>

              {/* Slab rows */}
              <div className="space-y-1.5">
                {slabs.map((slab, i) => {
                  const isActive = result.taxableIncome > slab.min;
                  const isCurrent = slab.min === result.marginalSlab.min;
                  const slabMax = slab.max ?? null;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs transition-all ${
                        isCurrent
                          ? `${slabColors[i].badge} ${slabColors[i].border} font-medium`
                          : isActive
                          ? "border-slate-100 bg-slate-50 text-slate-600"
                          : "border-transparent bg-transparent text-slate-400"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${isActive ? slabColors[i].bar : "bg-slate-200"}`}
                      />
                      <span className="flex-1">
                        {formatNumber(slab.min)} – {slabMax ? formatNumber(slabMax) : "above"}
                      </span>
                      <span className="font-semibold">{slab.label}</span>
                      <span className="ml-1 text-[10px] opacity-60">fixed: {formatPKR(slab.fixed)}</span>
                      {isCurrent && (
                        <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          you
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[10px] text-slate-400">
                Tax formula: Fixed component + (taxable income − slab floor) × slab rate
              </p>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-600">Need to file? We can help.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/personal/tax-return"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  FBR Tax Return Filing
                </Link>
                <Link
                  href="/personal/ntn"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  NTN Registration
                </Link>
                <Link
                  href="/contact"
                  className="col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Contact Akbar Tax Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full slab guide section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Pakistan income tax slabs 2025-26 — complete guide</h2>

        <div className="mt-4">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 p-2 text-left text-slate-600">Annual income (PKR)</th>
                <th className="border border-slate-200 p-2 text-left text-slate-600">Rate</th>
                <th className="border border-slate-200 p-2 text-left text-slate-600">Fixed</th>
              </tr>
            </thead>
            <tbody>
              {SALARIED_SLABS.map((slab, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 p-2">
                    {formatNumber(slab.min)} – {slab.max ? formatNumber(slab.max) : "above"}
                  </td>
                  <td className="border border-slate-200 p-2 font-semibold text-blue-700">{slab.label}</td>
                  <td className="border border-slate-200 p-2 text-slate-500">{formatPKR(slab.fixed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1.5 text-[10px] text-slate-400">
            + 9% surcharge on tax if annual income exceeds PKR 10 million
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">How is income tax calculated in Pakistan?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Pakistan uses a <strong>progressive slab system</strong>. Your taxable income is first determined by
              subtracting allowable deductions (medical allowance exemption, zakat / charitable donations) from gross annual income. Then
              the applicable slab&lsquo;s formula is used: <code className="rounded bg-slate-100 px-1 text-xs">Tax = Fixed Component + (Taxable Income − Slab Floor) × Slab Rate</code>.
              Only the income <em>within each slab band</em> is taxed at that band&apos;s rate — not the entire income.
              For incomes above PKR 10 million, a 9% surcharge is applied on top of slab tax.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What is the FBR tax return deadline for 2026?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              The expected deadline is <strong>September 30, 2026</strong>. Filing on time keeps your Active Taxpayer
              List (ATL) status intact, which means lower withholding rates on banking, property, and investment
              transactions. Late filers face penalties and higher WHT deductions throughout the year.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What are the benefits of being a tax filer?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              ATL filers pay significantly lower withholding tax on property purchases/sales, cash withdrawals above
              PKR 50,000/day, bank profit, dividends, and vehicle purchases. Filing also strengthens visa
              applications, loan eligibility, and business credibility with clients and banks.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">What deductions can salaried employees claim?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Common deductions include: medical allowance (up to 10% of basic or PKR 25,000/year), zakat / charitable
              donations (fully deductible, no cap), provident fund contributions (subject to limits), and education
              allowance (up to 20% of salary or PKR 50,000/year). This calculator currently handles medical allowance
              and zakat / charitable donations. Consult a tax advisor for the full picture.
            </p>
          </div>
        </div>

        {/* CTA block */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-sm font-semibold">Not sure how to file? We handle it end-to-end.</p>
            <p className="text-xs text-slate-400">Akbar Tax Store — certified tax filing assistance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={waURL}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_clicked", { calculator: "income-tax", location: "footer" })}
              className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              WhatsApp Us
            </a>
            <Link href="/personal/tax-return" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">
              Tax Return Filing
            </Link>
            <Link href="/personal/ntn" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">
              NTN Registration
            </Link>
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">{DISCLAIMER}</p>
      </div>
    </div>
  );
}