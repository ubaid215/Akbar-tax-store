"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPKR, parseInputNumber, withCommas } from "@/lib/taxData";

const DISCLAIMER =
  "Disclaimer: This calculator provides estimates based on Finance Act 2025 (FY 2025-26) tax slabs published by the Federal Board of Revenue (FBR). Results are for guidance purposes only. Your actual tax liability may differ based on specific deductions, exemptions, allowances, and other factors applicable to your individual circumstances. Always consult a certified tax advisor or contact Akbar Tax Store for a personalized assessment.";

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
  const track = (event: string, params: Record<string, string | number> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };
  useEffect(() => {
    track("result_viewed", { calculator: "filer-vs-non-filer", savings: Math.round(result.total) });
  }, [result.total]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Filer vs Non-Filer Savings Calculator Pakistan 2025</h1>
        <p className="mt-2 text-sm text-slate-600">
          Non-filers can no longer buy property or vehicles in Pakistan under current policy restrictions.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Annual Salary / Income (PKR)", annualIncome, setAnnualIncome],
            ["Annual Bank Withdrawals (PKR)", cashWithdrawals, setCashWithdrawals],
            ["Property Value (PKR)", propertyValue, setPropertyValue],
            ["Annual Dividend Income (PKR)", dividendIncome, setDividendIncome],
            ["Annual Bank Profit / Interest (PKR)", bankProfit, setBankProfit],
          ].map(([label, value, setter]) => (
            <label className="space-y-1" key={label as string}>
              <span className="text-sm font-medium text-slate-700">{label as string}</span>
              <input
                value={value as string}
                onChange={(e) => {
                  (setter as (v: string) => void)(withCommas(e.target.value));
                  track("calculator_used", { calculator: "filer-vs-non-filer", field: label as string });
                }}
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
              />
            </label>
          ))}
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Transaction Type (Property)</span>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
            >
              <option value="none">None</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="both">Both</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border-l-4 border-[#276749] bg-white p-5 shadow-md">
        <p className="text-sm text-slate-500">By becoming a filer, you save</p>
        <p className="text-3xl font-bold text-[#276749]">{formatPKR(result.total)} per year</p>
        {result.total > 10000 && (
          <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Your Akbar Tax Store filing fee pays for itself in {daysToRecoverFee} days.
          </p>
        )}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-left">Transaction</th>
                <th className="border p-2 text-left">Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-2">Cash Withdrawal (Sec 231AB)</td><td className="border p-2">{formatPKR(result.bankWithdrawalSaved)}</td></tr>
              <tr><td className="border p-2">Property Purchase (Sec 236K)</td><td className="border p-2">{formatPKR(result.propertyBuySaved)}</td></tr>
              <tr><td className="border p-2">Property Sale (Sec 236C)</td><td className="border p-2">{formatPKR(result.propertySellSaved)}</td></tr>
              <tr><td className="border p-2">Dividend Income (Sec 150)</td><td className="border p-2">{formatPKR(result.dividendSaved)}</td></tr>
              <tr><td className="border p-2">Bank Profit (Sec 151)</td><td className="border p-2">{formatPKR(result.bankProfitSaved)}</td></tr>
            </tbody>
          </table>
        </div>
        <a
          href={waURL}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_clicked", { calculator: "filer-vs-non-filer" })}
          className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
        >
          Become a Filer in 24 Hours - PKR 9,000 total
        </a>
        <p className="mt-4 text-xs text-slate-500">{DISCLAIMER}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">What is the Difference Between a Filer and Non-Filer in Pakistan?</h2>
        <p className="mt-2 text-sm text-slate-700">Filers are active taxpayers who submit annual returns and appear on the Active Taxpayer List. Non-filers face significantly higher withholding rates and practical restrictions in financial and asset transactions.</p>
        <h2 className="mt-5 text-xl font-bold">Non-Filer Penalties in Pakistan 2025-26 - Complete List</h2>
        <p className="mt-2 text-sm text-slate-700">Key penalties include higher tax on property purchase/sale, dividends, banking profits, and cash withdrawals. Current policy also limits non-filer access to property and vehicle purchase pathways.</p>
        <h2 className="mt-5 text-xl font-bold">How to Check Your FBR Filer Status - SMS 9966 to send your CNIC</h2>
        <h2 className="mt-5 text-xl font-bold">How to Become an Active Taxpayer in Pakistan - Step by Step</h2>
        <a href={waURL} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white">
          File Now for PKR 5,000 - Become Active in 24 Hours
        </a>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/ntn">
            NTN Registration
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/tax-return">
            FBR Tax Return Filing
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
