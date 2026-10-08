"use client";

import { useMemo, useRef } from "react";

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
    // Point in the sweep (0–1, measured from 12 o'clock) at which this dot fills.
    at: ((((deg + 90) * SIGN) % 360) + 360) % 360 / 360,
  };
});

/** Index of the dot nearest the middle of each step's arc. */
function middleDots(stepCount: number) {
  return Array.from({ length: stepCount }, (_, step) => {
    const mid = (step + 0.5) / stepCount;
    let best = 0;
    dots.forEach((d, i) => {
      if (Math.abs(d.at - mid) < Math.abs(dots[best].at - mid)) best = i;
    });
    return best;
  });
}

/** Figma "checkmark-icon" (582:898), 16×16, with its fill bound to --brand. */
function Checkmark({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <svg x={x - size / 2} y={y - size / 2} width={size} height={size} viewBox="0 0 16 16" overflow="visible">
      <path
        d="M14.6665 8C14.6665 4.3181 11.6817 1.33333 7.99987 1.33333C4.31797 1.33333 1.3332 4.3181 1.3332 8C1.3332 11.6819 4.31797 14.6667 7.99987 14.6667C11.6817 14.6667 14.6665 11.6819 14.6665 8Z"
        fill="var(--brand)"
      />
      <path
        d="M5.3332 8.5C5.3332 8.5 6.39987 9.10833 6.9332 10C6.9332 10 8.5332 6.5 10.6665 5.33333"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const checkDots = useMemo(() => new Set(middleDots(steps.length)), [steps.length]);

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
          stroke="var(--brand)"
          strokeWidth={RING.stroke}
          pathLength={100}
          strokeDasharray="0 100"
          transform={`rotate(-90 ${C} ${C})${SIGN < 0 ? ` scale(1 -1) translate(0 ${-RING.size})` : ""}`}
        />
        {dots.map((d, i) => (
          <g
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            className="group"
          >
            <circle
              cx={d.cx}
              cy={d.cy}
              r={RING.dots.diameter / 2}
              className={`fill-(--loader-dot-empty) transition-[fill,opacity,scale] duration-300 ease-out [transform-box:fill-box] origin-center group-data-filled:fill-(--brand) ${
                checkDots.has(i) ? "group-data-filled:scale-0 group-data-filled:opacity-0" : ""
              }`}
            />
            {checkDots.has(i) && (
              <g className="scale-0 opacity-0 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform-box:fill-box] origin-center group-data-filled:scale-100 group-data-filled:opacity-100 group-data-filled:duration-500">
                <Checkmark x={d.cx} y={d.cy} size={RING.dots.checkSize} />
              </g>
            )}
          </g>
        ))}
      </svg>

      <StepLabel
        labels={steps}
        active={step}
        className="absolute inset-0 text-[16px] tracking-[-0.5px] whitespace-nowrap text-navy-900"
      />
    </div>
  );
}
