"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPKR, parseInputNumber, whtRates, withCommas, type WhtCategory } from "@/lib/taxData";

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

  const waURL = `https://wa.me/923487300408?text=${encodeURIComponent(
    `Hi, I used your WHT calculator and my extra non-filer tax is PKR ${Math.round(values.extra)}. Help me become a filer.`,
  )}`;
  const track = (event: string, params: Record<string, string | number> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };
  useEffect(() => {
    track("result_viewed", { calculator: "withholding-tax", extra_tax: Math.round(values.extra) });
  }, [values.extra]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">Withholding Tax Calculator Pakistan 2025</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span className="text-sm">Payment Amount (PKR)</span><input value={paymentAmount} onChange={(e) => { setPaymentAmount(withCommas(e.target.value)); track("calculator_used", { calculator: "withholding-tax", field: "payment_amount" }); }} className="min-h-11 w-full rounded-lg border px-3" /></label>
          <label className="space-y-1"><span className="text-sm">Transaction Category</span><select value={category} onChange={(e) => setCategory(e.target.value as WhtCategory)} className="min-h-11 w-full rounded-lg border px-3">{Object.keys(whtRates).map((k) => <option key={k} value={k}>{k}</option>)}</select></label>
        </div>
      </section>
      <section className="rounded-2xl border-l-4 border-[#0040A8] bg-white p-5 shadow-md">
        <p>Filer Rate: <strong>{(current.filer * 100).toFixed(2)}%</strong> | Non-Filer Rate: <strong>{(current.nonFiler * 100).toFixed(2)}%</strong></p>
        <p>Tax Withheld (Filer): <strong>{formatPKR(values.filerTax)}</strong></p>
        <p>Tax Withheld (Non-Filer): <strong>{formatPKR(values.nonFilerTax)}</strong></p>
        <p>Extra Tax as Non-Filer: <strong>{formatPKR(values.extra)}</strong></p>
        <p className="mt-2 text-sm text-slate-600">{current.section} - {current.note}</p>
        {values.extra > 5000 && <a href={waURL} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "withholding-tax" })} className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white">Become a filer and save {formatPKR(values.extra)}</a>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">What is Withholding Tax in Pakistan?</h2>
        <p className="mt-2">Withholding tax is advance tax deducted at source on specified payments. The payer usually deducts and deposits this amount under relevant legal sections.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Who Deducts Withholding Tax?</h2>
        <p className="mt-2">Employers, banks, property buyers, and companies paying vendors are common withholding agents.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Can I Claim WHT Back in My Tax Return?</h2>
        <p className="mt-2">Yes, active filers can generally adjust allowable withholding amounts in annual return and wealth statement workflow.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">WHT Rates for Services in Pakistan 2025-26 - Complete List</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/tax-return">
            FBR Tax Return Filing
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/ntn">
            NTN Registration
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/filer">
            Filer Status
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/contact">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
