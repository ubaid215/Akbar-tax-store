import type { Metadata } from "next";
import FreelancerTaxClient from "./ui";

export const metadata: Metadata = {
  title: "Freelancer Tax Calculator Pakistan 2025-26 | PSEB vs Non-PSEB | Akbar Tax Store",
  description:
    "Calculate tax on Upwork, Fiverr, and freelance income in Pakistan. Compare PSEB 0.25% final tax versus non-salaried slab taxation.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/freelancer-tax-pakistan",
  },
};

export default function FreelancerTaxPakistanPage() {
  return <FreelancerTaxClient />;
}
