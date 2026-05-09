"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import CalculatorSwitcher from "./CalculatorSwitcher";

export default function CalculatorsShell({ children }: { children: ReactNode }) {
  const [calculatorMenuOpen, setCalculatorMenuOpen] = useState(false);

  return (
    <>
      <Navbar />
      {/* Match fixed Navbar height: mobile ~102px (no utility strip), md+ ~142px (strip + main row + logo) */}
      <div className="min-h-screen bg-slate-50 pt-[102px] md:pt-[142px]">
        <header
          className={`sticky border-b border-slate-200 bg-white/95 backdrop-blur ${
            calculatorMenuOpen ? "z-[100]" : "z-40"
          } top-[102px] md:top-[142px]`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#0040A8]">
              Akbar Tax Store
            </Link>
            <div className="w-full md:w-[380px]">
              <CalculatorSwitcher onOpenChange={setCalculatorMenuOpen} />
              <p className="mt-2 text-xs text-slate-500">
                Pakistan&apos;s Free Tax Calculators — Powered by FBR Data
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>

        <section className="mx-auto mb-6 flex w-full max-w-6xl flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <p className="text-sm text-slate-700 md:text-base">
            Need help filing? Our experts handle everything in 24 hours.
          </p>
          <a
            href="https://wa.me/923407300408"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
          >
            Chat on WhatsApp
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
