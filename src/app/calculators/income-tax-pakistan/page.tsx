import type { Metadata } from "next";
import IncomeTaxCalculatorClient from "./ui";

export const metadata: Metadata = {
  title: "Pakistan Income Tax Calculator 2026-27 | FBR Salary Tax | Akbar Tax Store",
  description:
    "Calculate your exact FBR income tax for 2026-27. Updated Finance Bill 2026 slabs for salaried & business. See full tax breakdown, effective rate, take-home pay, and slab-by-slab analysis. Free tool by Akbar Tax Store.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/income-tax-pakistan",
  },
  openGraph: {
    title: "Pakistan Income Tax Calculator 2026-27 | Akbar Tax Store",
    description:
      "Instant FBR income tax estimate for salaried & business. Finance Bill 2026 slabs, surcharge, zakat, medical allowance — full breakdown in seconds.",
    url: "https://www.akbartaxstore.com/calculators/income-tax-pakistan",
    siteName: "Akbar Tax Store",
    locale: "en_PK",
    type: "website",
  },
};

export default function IncomeTaxPakistanPage() {
  return <IncomeTaxCalculatorClient />;
}