"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BUSINESS_SLABS,
  SALARIED_SLABS,
  calculateIncomeTax,
  formatNumber,
  formatPKR,
  parseInputNumber,
  withCommas,
} from "@/lib/taxData";

const DISCLAIMER =
  "Disclaimer: This calculator provides estimates based on Finance Act 2025 (FY 2025-26) tax slabs published by the Federal Board of Revenue (FBR). Results are for guidance purposes only. Your actual tax liability may differ based on specific deductions, exemptions, allowances, and other factors applicable to your individual circumstances. Always consult a certified tax advisor or contact Akbar Tax Store for a personalized assessment.";

export default function IncomeTaxCalculatorClient() {
  const [monthlySalary, setMonthlySalary] = useState("50,000");
  const [incomeType, setIncomeType] = useState<"salaried" | "business">("salaried");
  const [annualBonus, setAnnualBonus] = useState("0");
  const [zakatPaid, setZakatPaid] = useState("0");
  const [hasMedicalAllowance, setHasMedicalAllowance] = useState(false);
  const [taxYear, setTaxYear] = useState("2025-26");

  const result = useMemo(
    () =>
      calculateIncomeTax({
        monthlySalary: parseInputNumber(monthlySalary),
        annualBonus: parseInputNumber(annualBonus),
        zakatPaid: parseInputNumber(zakatPaid),
        incomeType,
        hasMedicalAllowance,
      }),
    [monthlySalary, annualBonus, zakatPaid, incomeType, hasMedicalAllowance],
  );

  const waMessage = `Hi, I used your Income Tax Calculator and got: Annual Tax PKR ${Math.round(
    result.annualTax,
  )}. I need help filing.`;
  const waURL = `https://wa.me/923407300408?text=${encodeURIComponent(waMessage)}`;

  const totalBreakdown = result.breakdown.reduce((sum, s) => sum + s.amount, 0) || 1;
  const slabs = incomeType === "salaried" ? SALARIED_SLABS : BUSINESS_SLABS;
  const track = (event: string, params: Record<string, string | number> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };

  useEffect(() => {
    track("result_viewed", { calculator: "income-tax", annual_tax: Math.round(result.annualTax) });
  }, [result.annualTax]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is the salary tax rate in Pakistan for 2025-26?", acceptedAnswer: { "@type": "Answer", text: "Salaried rates start from 0% and go up to 35% under Finance Act 2025, plus surcharge for high incomes." } },
              { "@type": "Question", name: "How is income tax calculated in Pakistan?", acceptedAnswer: { "@type": "Answer", text: "Annual income is adjusted for allowable deductions, then progressive FBR slabs are applied to compute tax." } },
              { "@type": "Question", name: "What is the FBR return deadline for Tax Year 2026?", acceptedAnswer: { "@type": "Answer", text: "The commonly announced filing deadline for Tax Year 2026 is September 30, 2026 unless extended by FBR." } },
              { "@type": "Question", name: "Does zakat reduce taxable income?", acceptedAnswer: { "@type": "Answer", text: "Yes, zakat paid can be deducted before tax calculation in this estimate tool." } },
              { "@type": "Question", name: "Should I consult a tax advisor after using calculator?", acceptedAnswer: { "@type": "Answer", text: "Yes. Calculator values are estimates and a certified advisor should review your full tax profile." } },
            ],
          }),
        }}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Pakistan Income Tax Calculator 2025-26</h1>
        <p className="mt-2 text-sm text-slate-600">
          Updated for Finance Act 2025 | FY July 2025 - June 2026
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Monthly Gross Salary (PKR)</span>
            <input
              value={monthlySalary}
              onChange={(e) => {
                setMonthlySalary(withCommas(e.target.value));
                track("calculator_used", { calculator: "income-tax", field: "monthly_salary" });
              }}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Annual Bonus (PKR)</span>
            <input
              value={annualBonus}
              onChange={(e) => {
                setAnnualBonus(withCommas(e.target.value));
                track("calculator_used", { calculator: "income-tax", field: "annual_bonus" });
              }}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Zakat Paid (PKR)</span>
            <input
              value={zakatPaid}
              onChange={(e) => {
                setZakatPaid(withCommas(e.target.value));
                track("calculator_used", { calculator: "income-tax", field: "zakat" });
              }}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Tax Year</span>
            <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 px-3">
              <option>2025-26</option>
              <option>2024-25</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={incomeType === "salaried"} onChange={() => setIncomeType("salaried")} />
            Salaried
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={incomeType === "business"} onChange={() => setIncomeType("business")} />
            Business
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hasMedicalAllowance} onChange={(e) => setHasMedicalAllowance(e.target.checked)} />
            Medical Allowance included?
          </label>
        </div>
      </section>

      <section className="rounded-2xl border-l-4 border-[#0040A8] bg-white p-5 shadow-md">
        <p className="text-sm text-slate-500">Annual Tax (PKR)</p>
        <p className="text-3xl font-bold text-slate-900">{formatPKR(result.annualTax)}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <p className="text-sm text-slate-700">Monthly Tax Deduction: <strong>{formatPKR(result.monthlyTax)}</strong></p>
          <p className="text-sm text-slate-700">Take-Home Monthly Pay: <strong>{formatPKR(result.takeHomeMonthly)}</strong></p>
          <p className="text-sm text-slate-700">Effective Tax Rate: <strong>{result.effectiveRate.toFixed(2)}%</strong></p>
          <p className="text-sm text-slate-700">Marginal Tax Slab: <strong>You are in the {result.marginalSlab.label} slab</strong></p>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Income distribution across slabs</p>
          <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
            {result.breakdown.map((item) => (
              <div
                key={item.label}
                title={`${item.label} (${formatNumber(item.amount)})`}
                style={{ width: `${(item.amount / totalBreakdown) * 100}%` }}
                className="h-4 border-r border-white bg-[#0040A8]/70"
              />
            ))}
          </div>
        </div>
        <a
          href={waURL}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_clicked", { calculator: "income-tax" })}
          className="mt-5 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
        >
          Get Filing Help on WhatsApp
        </a>
        <p className="mt-4 text-xs text-slate-500">{DISCLAIMER}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">Pakistan Income Tax Slabs 2025-26 - Complete Guide</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-left">Annual Income</th>
                <th className="border p-2 text-left">Rate</th>
                <th className="border p-2 text-left">Fixed Component</th>
              </tr>
            </thead>
            <tbody>
              {slabs.map((slab) => (
                <tr key={`${slab.min}-${slab.label}`}>
                  <td className="border p-2">
                    {formatNumber(slab.min)} - {slab.max ? formatNumber(slab.max) : "Above"}
                  </td>
                  <td className="border p-2">{slab.label}</td>
                  <td className="border p-2">{formatPKR(slab.fixed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-900">How is Salary Tax Calculated in Pakistan?</h2>
        <p className="mt-2 text-sm leading-7">
          This calculator follows FBR Finance Act 2025 logic step by step. First, annual income is calculated from
          monthly salary and annual bonus. Then eligible deductions such as medical allowance and zakat are
          subtracted to estimate taxable income. A progressive slab structure applies, meaning higher slices of
          income are taxed at higher rates. For high earners above PKR 10 million, surcharge is added based on income
          type. The tool instantly updates annual tax, monthly deduction, and effective rate so users can plan
          better payroll and savings decisions.
        </p>
        <h2 className="mt-6 text-xl font-bold text-slate-900">What is the FBR Tax Return Deadline 2026?</h2>
        <p className="mt-2 text-sm leading-7">
          The expected deadline is <strong>September 30, 2026</strong>. Filing on time helps avoid penalties and keeps
          your Active Taxpayer status intact. Late filing can cause higher withholding rates on common transactions.
        </p>
        <h2 className="mt-6 text-xl font-bold text-slate-900">Benefits of Being a Tax Filer in Pakistan</h2>
        <p className="mt-2 text-sm leading-7">
          Active filers usually pay lower withholding tax on property, vehicle, banking, and investment transactions.
          Filing also supports visa documentation, loan eligibility, and business credibility. For salaried and
          self-employed taxpayers, annual return filing creates a clean compliance history with FBR.
        </p>
        <p className="mt-2 text-sm leading-7">
          A practical approach is to use this calculator as your planning baseline each month. If your income changes,
          update values immediately and compare effective rate movement. This helps with payroll forecasting,
          allowance planning, and avoiding year-end surprises. It is also useful for freelancers and business owners
          with mixed income sources who want an initial estimate before full return preparation.
        </p>
        <div className="mt-6 rounded-xl bg-slate-100 p-4">
          <p className="font-semibold">Not sure how to file? Let Akbar Tax Store handle it.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={waURL} target="_blank" rel="noreferrer" className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
              WhatsApp Us
            </a>
            <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/tax-return">
              FBR Tax Return Filing
            </Link>
            <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/ntn">
              NTN Registration
            </Link>
            <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
