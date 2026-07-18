import type { Metadata } from "next";
import ShouldIFileQuizClient from "./ui";

export const metadata: Metadata = {
  title: "Should I File Tax Return Quiz Pakistan | Akbar Tax Store",
  description:
    "Take a 5-question quiz to know if you should file a tax return in Pakistan and get a tailored WhatsApp action plan.",
  alternates: {
    canonical: "https://www.akbartaxstore.com/calculators/should-i-file-quiz",
  },
};

export default function ShouldIFileQuizPage() {
  return <ShouldIFileQuizClient />;
}