import type { Metadata } from "next";
import GSTCalculatorClient from "./ui";

export const metadata: Metadata = {
  title: "GST Calculator Pakistan 2025 | FBR Sales Tax 18% | Akbar Tax Store",
  description:
    "Calculate GST and sales tax in Pakistan for goods, services, digital sales, and restaurant transactions with Finance Act 2025 rates.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/gst-calculator-pakistan",
  },
};

export default function GSTCalculatorPakistanPage() {
  return <GSTCalculatorClient />;
}
