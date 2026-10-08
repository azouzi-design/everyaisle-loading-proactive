"use client";

import { useRef } from "react";

import { DIRECTION, LOADING_STEPS, RING, TIMING } from "./config";
import { StepLabel } from "./StepLabel";
import { useStepTimeline } from "./useStepTimeline";

const C = RING.size / 2;
const RING_R = (RING.size - RING.stroke) / 2;
const SIGN = DIRECTION === "clockwise" ? 1 : -1;

const dots = Array.from({ length: RING.dots.count }, (_, i) => {
  const deg = RING.dots.startDeg + (360 / RING.dots.count) * i;
  const rad = (deg * Math.PI) / 180;
  return {
    cx: C + RING.dots.radius * Math.cos(rad),
    cy: C + RING.dots.radius * Math.sin(rad),
    // Point in the sweep (0–1, measured from 12 o'clock) at which this dot turns navy.
    at: ((((deg + 90) * SIGN) % 360) + 360) % 360 / 360,
  };
});

type Props = {
  steps?: readonly string[];
  timing?: typeof TIMING;
  className?: string;
};

/**
 * Outer ring + dotted inner track that fill navy step by step, with the current
 * step's label in the middle. Scales to its container's width.
 */
export function LoadingRing({ steps = LOADING_STEPS, timing = TIMING, className = "" }: Props) {
  const arcRef = useRef<SVGCircleElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  const step = useStepTimeline({
    stepCount: steps.length,
    ...timing,
    onFrame: ({ progress, fillOpacity }) => {
      const arc = arcRef.current;
      if (arc) {
        arc.style.strokeDasharray = `${progress * 100} 100`;
        arc.style.opacity = `${fillOpacity}`;
      }
      dots.forEach((dot, i) => {
        dotRefs.current[i]?.toggleAttribute("data-filled", fillOpacity === 1 && progress >= dot.at);
      });
    },
  });

  return (
    <div className={`relative aspect-square ${className}`}>
      <svg aria-hidden viewBox={`0 0 ${RING.size} ${RING.size}`} className="absolute inset-0 size-full">
        <circle cx={C} cy={C} r={RING_R} fill="none" stroke="var(--loader-empty)" strokeWidth={RING.stroke} />
        {/* SVG circles start at 3 o'clock; rotate to 12 and mirror for counter-clockwise. */}
        <circle
          ref={arcRef}
          cx={C}
          cy={C}
          r={RING_R}
          fill="none"
          stroke="var(--loader-filled)"
          strokeWidth={RING.stroke}
          pathLength={100}
          strokeDasharray="0 100"
          transform={`rotate(-90 ${C} ${C})${SIGN < 0 ? ` scale(1 -1) translate(0 ${-RING.size})` : ""}`}
        />
        {dots.map((d, i) => (
          <circle
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            cx={d.cx}
            cy={d.cy}
            r={RING.dots.diameter / 2}
            className="fill-(--loader-dot-empty) transition-[fill] duration-300 ease-out data-filled:fill-(--loader-filled)"
          />
        ))}
      </svg>

      <StepLabel
        labels={steps}
        active={step}
        className="absolute inset-0 text-[16px] tracking-[-0.5px] whitespace-nowrap text-navy-700"
      />
    </div>
  );
}
