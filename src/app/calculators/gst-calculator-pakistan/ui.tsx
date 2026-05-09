"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPKR, parseInputNumber, withCommas } from "@/lib/taxData";

const serviceRateByProvince: Record<string, number> = {
  Punjab: 0.16,
  Sindh: 0.15,
  KPK: 0.15,
  Balochistan: 0.15,
  ICT: 0.15,
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
    if (type === "Services") return { rate: serviceRateByProvince[province], authority: province === "Punjab" ? "PRA" : province === "Sindh" ? "SRB" : province === "KPK" ? "KPRA" : province === "Balochistan" ? "BRA" : "FBR (ICT)" };
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
  const track = (event: string, params: Record<string, string | number> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };
  useEffect(() => {
    track("result_viewed", { calculator: "gst", tax_amount: Math.round(calc.tax) });
  }, [calc.tax]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">GST Calculator Pakistan 2025</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span className="text-sm">Amount (PKR)</span><input value={amount} onChange={(e) => { setAmount(withCommas(e.target.value)); track("calculator_used", { calculator: "gst", field: "amount" }); }} className="min-h-11 w-full rounded-lg border px-3" /></label>
          <label className="space-y-1"><span className="text-sm">Transaction Type</span><select value={type} onChange={(e) => setType(e.target.value)} className="min-h-11 w-full rounded-lg border px-3"><option>Goods</option><option>Services</option><option>Restaurant</option><option>Digital/E-Commerce</option><option>Import</option></select></label>
          <label className="space-y-1"><span className="text-sm">Mode</span><select value={mode} onChange={(e) => setMode(e.target.value as "exclusive" | "inclusive")} className="min-h-11 w-full rounded-lg border px-3"><option value="exclusive">Add tax to this price</option><option value="inclusive">Tax already included</option></select></label>
          {(type === "Services" || type === "Restaurant") && <label className="space-y-1"><span className="text-sm">Province</span><select value={province} onChange={(e) => setProvince(e.target.value)} className="min-h-11 w-full rounded-lg border px-3"><option>Punjab</option><option>Sindh</option><option>KPK</option><option>Balochistan</option><option>ICT</option></select></label>}
          {type === "Restaurant" && province === "Sindh" && <label className="space-y-1"><span className="text-sm">Payment Method</span><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="min-h-11 w-full rounded-lg border px-3"><option>Digital</option><option>Cash</option></select></label>}
        </div>
      </section>

      <section className="rounded-2xl border-l-4 border-[#0040A8] bg-white p-5 shadow-md">
        <p>Pre-tax Amount: <strong>{formatPKR(calc.preTax)}</strong></p>
        <p>GST/Tax Amount: <strong>{formatPKR(calc.tax)}</strong></p>
        <p>Total Amount: <strong>{formatPKR(calc.total)}</strong></p>
        <p className="mt-2 text-sm text-slate-600">Authority: {authority} | Applied rate: {(rate * 100).toFixed(2)}%</p>
        {calc.tax > 300000 && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">You may need GST Registration (Sec 236G). Akbar Tax Store handles this for PKR 40,000.</p>}
        <a
          href={`https://wa.me/923407300408?text=${encodeURIComponent(`Hi, I used your GST calculator and got tax ${Math.round(calc.tax)} PKR. Please guide GST registration.`)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_clicked", { calculator: "gst" })}
          className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
        >
          Get GST Help on WhatsApp
        </a>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">What is GST Rate in Pakistan 2025?</h2>
        <p className="mt-2">Federal GST is 18% on goods, while services are usually 15-16% depending on provincial authority.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Do I Need to Register for GST in Pakistan?</h2>
        <p className="mt-2">A common threshold is annual turnover above PKR 10 million, though specific sectors may trigger registration earlier.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">GST vs PRA vs SRB - What&apos;s the Difference?</h2>
        <p className="mt-2">FBR generally handles goods and federal scope, while PRA/SRB/KPRA/BRA manage services in their provinces.</p>
        <h2 className="mt-5 text-xl font-bold text-slate-900">How to File GST Return in Pakistan - FBR IRIS Portal</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/personal/gst">
            GST Registration
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href="/business/gst">
            Business GST
          </Link>
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
      </section>
    </div>
  );
}
