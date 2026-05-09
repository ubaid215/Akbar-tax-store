"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BUSINESS_SLABS, calculateSlabTax, formatPKR, parseInputNumber, withCommas } from "@/lib/taxData";

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
  const track = (event: string, params: Record<string, string | number> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };
  useEffect(() => {
    track("result_viewed", { calculator: "freelancer-tax", tax_non_pseb: Math.round(result.nonPsebTax) });
  }, [result.nonPsebTax]);
  const waURL = `https://wa.me/923487300408?text=${encodeURIComponent(
    `Hi, I used your Freelancer Tax Calculator. PSEB tax ${Math.round(result.psebTax)} and Non-PSEB tax ${Math.round(
      result.nonPsebTax,
    )}. Please help me file return.`,
  )}`;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">Freelancer Tax Calculator Pakistan 2025-26</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span className="text-sm">Freelance Platform</span><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="min-h-11 w-full rounded-lg border px-3"><option>Upwork</option><option>Fiverr</option><option>Toptal</option><option>Direct Client</option><option>Other</option></select></label>
          <label className="space-y-1"><span className="text-sm">Annual Freelance Income (USD)</span><input value={usdIncome} onChange={(e) => { setUsdIncome(withCommas(e.target.value)); track("calculator_used", { calculator: "freelancer-tax", field: "usd_income" }); }} className="min-h-11 w-full rounded-lg border px-3" /></label>
          <label className="space-y-1"><span className="text-sm">USD to PKR Exchange Rate</span><input value={rate} onChange={(e) => setRate(withCommas(e.target.value))} className="min-h-11 w-full rounded-lg border px-3" /></label>
          <label className="space-y-1"><span className="text-sm">PSEB Registered?</span><select value={psebRegistered} onChange={(e) => setPsebRegistered(e.target.value)} className="min-h-11 w-full rounded-lg border px-3"><option>Yes</option><option>No</option></select></label>
          <label className="space-y-1"><span className="text-sm">Any Local (PKR) Freelance Income?</span><input value={localIncome} onChange={(e) => setLocalIncome(withCommas(e.target.value))} className="min-h-11 w-full rounded-lg border px-3" /></label>
          <label className="space-y-1"><span className="text-sm">Business Expenses (PKR)</span><input value={expenses} onChange={(e) => setExpenses(withCommas(e.target.value))} className="min-h-11 w-full rounded-lg border px-3" /></label>
          <label className="space-y-1"><span className="text-sm">Zakat Paid (PKR)</span><input value={zakat} onChange={(e) => setZakat(withCommas(e.target.value))} className="min-h-11 w-full rounded-lg border px-3" /></label>
        </div>
      </section>
      <section className="rounded-2xl border-l-4 border-[#0040A8] bg-white p-5 shadow-md">
        <p>USD Income in PKR: <strong>{formatPKR(result.pkrFromUsd)}</strong></p>
        <p>Tax under PSEB path (0.25%): <strong>{formatPKR(result.psebTax)}</strong></p>
        <p>Tax under Non-PSEB path: <strong>{formatPKR(result.nonPsebTax)}</strong></p>
        <p>PSEB Savings Amount: <strong>{formatPKR(result.savings)}</strong></p>
        {result.savings > 20000 && <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">PSEB Registration is free - contact Akbar Tax Store to assist.</p>}
        <a href={waURL} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "freelancer-tax" })} className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white">
          Get Freelancer Filing Help
        </a>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">How is Freelance Income Taxed in Pakistan?</h2>
        <p className="mt-2">Freelancers are usually treated under non-salaried tax rules unless a specific export final tax regime applies.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">What is PSEB Registration and How Does it Reduce Tax?</h2>
        <p className="mt-2">PSEB-registered IT exporters can access final tax treatment at 0.25% on export proceeds, which can be significantly lower than slab tax.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Do Upwork and Fiverr Freelancers Pay Tax in Pakistan?</h2>
        <p className="mt-2">Yes. Income from international freelance platforms is taxable and return filing is still required under FBR framework.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">How to File Tax Return as a Freelancer in Pakistan - Step by Step</h2>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Pakistan Freelancer Tax Rate 2025-26 - Official FBR Rules</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/tax-return">
            FBR Tax Return Filing
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/ntn">
            NTN Registration
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/gst">
            GST / PRA Help
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/contact">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
