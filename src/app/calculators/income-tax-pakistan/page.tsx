import type { Metadata } from "next";
import IncomeTaxCalculatorClient from "./ui";

export const metadata: Metadata = {
  title: "Pakistan Income Tax Calculator 2025-26 | FBR Salary Tax | Akbar Tax Store",
  description:
    "Calculate your exact FBR income tax for 2025-26. Updated Finance Act 2025 slabs. Instant salaried & business tax estimate. Free tool by Akbar Tax Store.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/income-tax-pakistan",
  },
};

export default function IncomeTaxPakistanPage() {
  return <IncomeTaxCalculatorClient />;
}
