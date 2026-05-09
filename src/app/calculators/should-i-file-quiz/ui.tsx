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
  const track = (event: string, params: Record<string, string | number> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };
  useEffect(() => {
    if (done && result) {
      track("result_viewed", { calculator: "should-i-file-quiz", outcome: result.title });
    }
  }, [done, result]);

  if (done && result) {
    const wa = `https://wa.me/923407300408?text=${encodeURIComponent(`I took your quiz and got ${result.title}. ${result.cta}`)}`;
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Should I File? Quiz Result</h1>
        <p className="mt-4 text-3xl">{result.icon}</p>
        <p className="mt-2 text-xl font-semibold">{result.title}</p>
        <p className="mt-2 text-slate-700">{result.text}</p>
        <a href={wa} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { calculator: "should-i-file-quiz" })} className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white">{result.cta}</a>
        <Link href={result.link} className="mt-3 block text-sm text-[#0040A8] underline">Open recommended calculator</Link>
        <button onClick={() => navigator.clipboard.writeText(`Quiz result: ${result.title} - ${result.text}`)} className="mt-4 rounded-lg border px-4 py-2 text-sm">Share your result</button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Should I File Tax Return in Pakistan?</h1>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-[#0040A8] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-6 transition-all duration-300">
        <p className="text-lg font-semibold">{QUESTIONS[step].q}</p>
        <div className="mt-4 grid gap-3">
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
              className="min-h-11 rounded-lg border border-slate-300 px-4 py-3 text-left text-sm hover:bg-slate-50"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
