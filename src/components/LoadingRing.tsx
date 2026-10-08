"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  "Logging you into SmartMeals",
  "Linking to your HARPS loyalty",
  "Personalizing for you",
];

// Timeline (ms). Each step fills its third of the ring, then holds.
const FILL_MS = 1600;
const HOLD_MS = 800;
const STEP_MS = FILL_MS + HOLD_MS;
const RESET_MS = 500;
const CYCLE_MS = STEPS.length * STEP_MS + RESET_MS;

// Geometry, in Figma frame units (ring node 581:810 is 334×334, 7.34 thick).
const RING_SIZE = 334;
const RING_STROKE = 7.34;
const RING_R = (RING_SIZE - RING_STROKE) / 2;

// Dot track (Figma "Repeat group 1"): 22 dots on a 147px radius, offset from 12 o'clock.
const DOT_COUNT = 22;
const DOT_RADIUS = 147;
const DOT_START_DEG = -96.3;

const EMPTY = "var(--color-navy-200)";
const DOT_EMPTY = "#CFD4DC";
const FILLED = "var(--color-navy-900)";

const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
  const deg = DOT_START_DEG + (360 / DOT_COUNT) * i;
  const rad = (deg * Math.PI) / 180;
  return {
    cx: +(150 + DOT_RADIUS * Math.cos(rad)).toFixed(2),
    cy: +(150 + DOT_RADIUS * Math.sin(rad)).toFixed(2),
    // Fraction of the counter-clockwise sweep from 12 o'clock at which this dot fills.
    at: ((((-90 - deg) % 360) + 360) % 360) / 360,
  };
});

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function LoadingRing() {
  const [{ step, prev }, setStep] = useState({ step: 0, prev: -1 });
  const arcRef = useRef<SVGCircleElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const filled = dots.map(() => false);
    let elapsed = 0;
    let last = performance.now();
    let currentStep = 0;
    let frame = 0;

    const render = (now: number) => {
      // Cap the delta so a backgrounded tab resumes where it left off.
      elapsed = (elapsed + Math.min(now - last, 100)) % CYCLE_MS;
      last = now;

      const stepIndex = Math.min(Math.floor(elapsed / STEP_MS), STEPS.length - 1);
      const resetting = elapsed >= STEPS.length * STEP_MS;
      const local = elapsed - stepIndex * STEP_MS;
      const stepFill = reduceMotion ? 1 : easeInOut(Math.min(local / FILL_MS, 1));
      const progress = resetting ? 1 : (stepIndex + stepFill) / STEPS.length;

      const arc = arcRef.current;
      if (arc) {
        arc.style.strokeDasharray = `${progress * 100} 100`;
        arc.style.opacity = resetting ? `${1 - (elapsed - STEPS.length * STEP_MS) / RESET_MS}` : "1";
      }

      dots.forEach((dot, i) => {
        const on = !resetting && progress >= dot.at;
        if (on !== filled[i]) {
          filled[i] = on;
          dotRefs.current[i]?.style.setProperty("fill", on ? FILLED : DOT_EMPTY);
        }
      });

      const nextStep = resetting ? 0 : stepIndex;
      if (nextStep !== currentStep) {
        setStep({ step: nextStep, prev: currentStep });
        currentStep = nextStep;
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <svg
        aria-hidden
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="absolute left-[28px] top-[440px]"
      >
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke={EMPTY} strokeWidth={RING_STROKE} />
        {/* Start at 12 o'clock and sweep counter-clockwise, as in the Figma arc. */}
        <circle
          ref={arcRef}
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_R}
          fill="none"
          stroke={FILLED}
          strokeWidth={RING_STROKE}
          pathLength={100}
          strokeDasharray="0 100"
          transform={`translate(${RING_SIZE} 0) scale(-1 1) rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </svg>

      <svg aria-hidden width={300} height={300} viewBox="0 0 300 300" className="absolute left-[45px] top-[458.83px]">
        {dots.map((d, i) => (
          <circle
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            cx={d.cx}
            cy={d.cy}
            r={2.5}
            fill={DOT_EMPTY}
            className="transition-[fill] duration-300 ease-out"
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 top-[598px] h-[19px]" role="status" aria-live="polite">
        {/* Outgoing label exits upward; the rest wait below. */}
        {STEPS.map((label, i) => (
          <p
            key={label}
            aria-hidden={i !== step}
            className={`absolute inset-x-0 whitespace-nowrap text-center text-[16px] tracking-[-0.5px] text-navy-700 transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 ${
              i === step ? "translate-y-0 opacity-100" : i === prev ? "-translate-y-2 opacity-0" : "translate-y-2 opacity-0"
            }`}
          >
            {label}
          </p>
        ))}
      </div>
    </>
  );
}
