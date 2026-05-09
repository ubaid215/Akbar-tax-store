import type { Metadata } from "next";
import WithholdingTaxClient from "./ui";

export const metadata: Metadata = {
  title: "Withholding Tax Calculator Pakistan 2025 | WHT Rates | Akbar Tax Store",
  description:
    "Calculate withholding tax in Pakistan by transaction type, filer status, and section references from Finance Act 2025.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/withholding-tax-pakistan",
  },
};

export default function WithholdingTaxPakistanPage() {
  return <WithholdingTaxClient />;
}
