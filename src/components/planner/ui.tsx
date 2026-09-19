"use client";

import { useRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const ACCENT = "#2997ff";

/** Button whose surface glows under the cursor — the hover effect used across the planner. */
export function SpotlightButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      className={`spotlight ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function StepHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="rise text-sm font-semibold tracking-wide" style={{ color: ACCENT }}>
        {eyebrow}
      </p>
      <h1
        className="rise mt-3 bg-gradient-to-b from-white to-white/55 bg-clip-text pb-1 text-5xl font-semibold tracking-tight text-transparent md:text-6xl"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {title}
      </h1>
      {sub && (
        <p className="rise mx-auto mt-4 max-w-xl text-lg text-[#a1a1a6] md:text-xl" style={{ "--i": 2 } as React.CSSProperties}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** Circular score gauge (0-100) that animates when the value changes. */
export function Ring({ pct, size = 64, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={ACCENT}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.2, 0.7, 0.2, 1)" }}
      />
    </svg>
  );
}

export function CheckBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pop-in flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${className}`}
      style={{ background: ACCENT }}
      aria-hidden
    >
      ✓
    </span>
  );
}
