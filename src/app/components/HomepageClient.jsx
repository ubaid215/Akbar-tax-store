'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { HERO_TYPING_TEXTS, HOME_STATS } from '@/constants';

// ── Typing animation ──────────────────────────────────────────────────────────
function TypingAnimation() {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex]     = useState(0);
  const [isDeleting, setIsDeleting]   = useState(false);
  // Stable ref so the effect closure never goes stale
  const stateRef = useRef({ displayText: '', textIndex: 0, isDeleting: false });

  useEffect(() => {
    stateRef.current = { displayText, textIndex, isDeleting };
  });

  useEffect(() => {
    let timer;

    const tick = () => {
      const { displayText: current, textIndex: idx, isDeleting: deleting } =
        stateRef.current;
      const fullText = HERO_TYPING_TEXTS[idx];

      if (!deleting) {
        // Still typing forward
        if (current.length < fullText.length) {
          setDisplayText(fullText.slice(0, current.length + 1));
          timer = setTimeout(tick, 100);
        } else {
          // Finished typing — pause then start deleting
          timer = setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        // Deleting
        if (current.length > 0) {
          setDisplayText(fullText.slice(0, current.length - 1));
          timer = setTimeout(tick, 50);
        } else {
          // Finished deleting — move to next text
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % HERO_TYPING_TEXTS.length);
        }
      }
    };

    timer = setTimeout(tick, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  return (
    <div className="h-10 flex items-center justify-center mb-2">
      <span
        className="text-lg sm:text-xl font-medium"
        style={{ color: '#0040A8' }}
        aria-hidden="true" // decorative — not read by screen readers or crawlers
      >
        → {displayText}
        <span
          className="animate-pulse ml-0.5 inline-block"
          style={{ borderRight: '2px solid #0040A8', height: '1.1em', verticalAlign: 'text-bottom' }}
        />
      </span>
    </div>
  );
}

// ── Counter animation ─────────────────────────────────────────────────────────
// Finds each stat element by its id (set in page.jsx), reads the static value
// already in the DOM (so Google always sees the real number), then animates
// from 0 → animateTo on scroll-into-view.
function CounterAnimation() {
  const hasRun = useRef(false);

  // Easing: ease-out-quart feels snappy without being jarring
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateStat = useCallback((stat) => {
    const el = document.getElementById(stat.id);
    if (!el) return;

    // Special cases: hours shows "hrs" suffix, legal/services show "+"  or "%"
    const suffix = stat.value.replace(/[0-9]/g, ''); // e.g. "+", "hrs", "%"
    const duration = 1800;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.floor(stat.animateTo * eased);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Restore the original display value exactly as defined in constants
        el.textContent = stat.value;
      }
    };

    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    // Find the first stat element to attach the observer to the stats section
    const firstEl = document.getElementById(HOME_STATS[0]?.id);
    if (!firstEl || hasRun.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            // Stagger each counter by 150ms for a cascade effect
            HOME_STATS.forEach((stat, i) => {
              setTimeout(() => animateStat(stat), i * 150);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(firstEl);
    return () => observer.disconnect();
  }, [animateStat]);

  // Renders nothing — purely a DOM-manipulation side effect
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────
// Single export, controlled by `section` prop:
//   <HomepageClient section="hero-typing" />  → typing animation
//   <HomepageClient section="counters" />     → counter observer (no output)
export default function HomepageClient({ section }) {
  if (section === 'hero-typing') return <TypingAnimation />;
  if (section === 'counters')    return <CounterAnimation />;
  return null;
}