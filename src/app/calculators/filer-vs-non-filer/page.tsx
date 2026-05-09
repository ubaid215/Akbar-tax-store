import type { Metadata } from "next";
import FilerVsNonFilerClient from "./ui";

export const metadata: Metadata = {
  title: "Filer vs Non-Filer Tax Savings Calculator Pakistan 2025 | Akbar Tax Store",
  description:
    "See how much tax you overpay as a non-filer in Pakistan. Compare bank, property & vehicle taxes. Become a filer in 24 hours with Akbar Tax Store.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/filer-vs-non-filer",
  },
};

export default function FilerVsNonFilerPage() {
  return <FilerVsNonFilerClient />;
}
