"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export const CALCULATOR_ROUTES = [
  { value: "/calculators/income-tax-pakistan", label: "Salaried Income Tax Calculator" },
  { value: "/calculators/filer-vs-non-filer", label: "Filer vs Non-Filer Savings Calculator" },
  { value: "/calculators/gst-calculator-pakistan", label: "GST / Sales Tax Calculator" },
  { value: "/calculators/withholding-tax-pakistan", label: "Withholding Tax Calculator" },
  { value: "/calculators/freelancer-tax-pakistan", label: "Freelancer Tax Calculator" },
  { value: "/calculators/should-i-file-quiz", label: "Should I File? Quiz" },
] as const;

type Props = {
  className?: string;
  /** Lets parent layout raise its z-index while the menu is open (above fixed Navbar z-50). */
  onOpenChange?: (open: boolean) => void;
};

export default function CalculatorSwitcher({ className = "", onOpenChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const setMenuOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const active =
    CALCULATOR_ROUTES.find((r) => r.value === pathname) ?? CALCULATOR_ROUTES[0];

  const close = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border-2 border-[#0040A8]/25 bg-white px-4 py-2.5 text-left text-sm font-medium text-slate-800 shadow-sm transition hover:border-[#0040A8]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0040A8] focus-visible:ring-offset-2"
        onClick={() => setMenuOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Choose a tax calculator"
      >
        <span className="truncate">{active.label}</span>
        <span
          className={`shrink-0 text-[#0040A8] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] max-h-[min(70vh,420px)] overflow-auto rounded-xl border-2 border-[#0040A8]/20 bg-white py-2 shadow-xl"
          role="listbox"
        >
          {CALCULATOR_ROUTES.map((route) => {
            const selected = route.value === pathname;
            return (
              <li key={route.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "bg-[#0040A8]/10 font-semibold text-[#0040A8]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    setMenuOpen(false);
                    if (route.value !== pathname) router.push(route.value);
                  }}
                >
                  {route.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
