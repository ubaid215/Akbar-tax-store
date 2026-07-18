"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const QUESTIONS = [
  { q: "What is your main source of income?", a: ["Salary from a job", "Freelance / online work", "Business or shop", "I don't earn income currently"] },
  { q: "What is your approximate annual income?", a: ["Under PKR 600,000 per year", "PKR 600,000 - 1,200,000", "PKR 1,200,000 - 4,000,000", "Over PKR 4,000,000"] },
  { q: "Have you ever filed an FBR income tax return?", a: ["Yes, I file every year", "I filed once or twice, not consistently", "Never filed", "Not sure"] },
  { q: "Do you own property or a vehicle, or plan to buy one?", a: ["Yes, I own property / vehicle", "Planning to buy in the next 12 months", "No plans currently"] },
  { q: "Do you have a bank account with savings or fixed deposits?", a: ["Yes, regular transactions / savings", "Basic account, minimal activity", "No bank account"] },
];

const resultColors: Record<string, { bg: string; text: string; badge: string }> = {
  "Must File - Urgently":      { bg: "bg-red-50",     text: "text-red-700",     badge: "bg-red-100 text-red-700" },
  "Should File - Big Savings": { bg: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  "Recommended - Peace of Mind": { bg: "bg-blue-50",  text: "text-blue-700",   badge: "bg-blue-100 text-blue-700" },
};

const track = (event: string, params: Record<string, string | number> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
};

export default function ShouldIFileQuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const done = step >= QUESTIONS.length;

  const result = useMemo(() => {
    if (!done) return null;
    const incomeAns = answers[1] || "";
    const propertyAns = answers[3] || "";
    const bankAns = answers[4] || "";
    if (incomeAns.includes("1,200,000") || incomeAns.includes("Over") || propertyAns.includes("own") || bankAns.includes("regular")) {
      return { icon: "⚠️", title: "Must File - Urgently", text: "You are legally required to file. Every year you don't file increases your penalties.", cta: "I need to file - help me", link: "/calculators/income-tax-pakistan" };
    }
    if (incomeAns.includes("Under") && (propertyAns.includes("Planning") || bankAns.includes("minimal"))) {
      return { icon: "💰", title: "Should File - Big Savings", text: "You may not owe much income tax, but filer status saves major costs on property and banking taxes.", cta: "Show me how much I save", link: "/calculators/filer-vs-non-filer" };
    }
    return { icon: "✅", title: "Recommended - Peace of Mind", text: "Filing is optional for you right now, but it protects you legally and builds credibility.", cta: "Register my NTN anyway", link: "/personal/ntn" };
  }, [done, answers]);

  const progress = (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (done && result) {
      track("result_viewed", { calculator: "should-i-file-quiz", outcome: result.title });
    }
  }, [done, result]);

  if (done && result) {
    const wa = `https://wa.me/923407300408?text=${encodeURIComponent(`I took your quiz and got ${result.title}. ${result.cta}`)}`;
    const colors = resultColors[result.title] ?? resultColors["Recommended - Peace of Mind"];

    return (
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Should I File? — Quiz Result</h1>
          <p className="mt-1 text-sm text-slate-500">Based on your answers · Finance Bill 2026 · FBR guidelines</p>
        </div>

        {/* Result card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold ${colors.badge}`}>
            <span>{result.icon}</span>
            <span>{result.title}</span>
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-700">{result.text}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_clicked", { calculator: "should-i-file-quiz" })}
              className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {result.cta}
            </a>
            <Link
              href={result.link}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Open recommended calculator
            </Link>
            <button
              onClick={() => navigator.clipboard.writeText(`Quiz result: ${result.title} - ${result.text}`)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Copy result
            </button>
          </div>
        </div>

        {/* Retake */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Want to try different answers?</p>
          <button
            onClick={() => { setStep(0); setAnswers([]); }}
            className="mt-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Retake quiz
          </button>
        </div>

        {/* CTA block */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-sm font-semibold">Need help filing or registering your NTN?</p>
            <p className="text-xs text-slate-400">Akbar Tax Store — certified tax filing assistance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">WhatsApp Us</a>
            <Link href="/personal/ntn" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">NTN Registration</Link>
            <Link href="/personal/tax-return" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20">Tax Return Filing</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Should I File Tax Return in Pakistan?</h1>
        <p className="mt-1 text-sm text-slate-500">5 quick questions · Finance Bill 2026 · FBR guidelines</p>
      </div>

      {/* Quiz card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Question {Math.min(step + 1, QUESTIONS.length)} of {QUESTIONS.length}</span>
            <span className="text-xs font-medium text-blue-600">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="transition-all duration-300">
          <p className="text-lg font-semibold text-slate-900">{QUESTIONS[step].q}</p>
          <div className="mt-4 grid gap-2.5">
            {QUESTIONS[step].a.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const next = [...answers];
                  next[step] = option;
                  setAnswers(next);
                  setStep(step + 1);
                  track("calculator_used", { calculator: "should-i-file-quiz", step: step + 1 });
                }}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 text-left text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-bold text-slate-400">
                  {String.fromCharCode(65 + QUESTIONS[step].a.indexOf(option))}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Back button */}
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-5 text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            ← Back to previous question
          </button>
        )}
      </div>

      {/* Info card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-600">Why does filing status matter?</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          Active filers pay significantly lower withholding tax on property, banking, dividends, and cash withdrawals. Non-filers can no longer purchase property or vehicles under current FBR policy.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Link href="/calculators/income-tax-pakistan" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Income Tax</Link>
          <Link href="/calculators/filer-vs-non-filer" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Filer Savings</Link>
          <Link href="/personal/ntn" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">NTN Registration</Link>
          <Link href="/contact" className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}