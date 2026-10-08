"use client";

import { useId, useMemo, useRef, type CSSProperties } from "react";

import { DIRECTION, LOADING_STEPS, RING, TIMING } from "./config";
import styles from "./LoadingRing.module.css";
import { StepLabel } from "./StepLabel";
import { useStepTimeline } from "./useStepTimeline";

const C = RING.size / 2;
const RING_R = (RING.size - RING.stroke) / 2;
const INNER_R = RING_R - RING.stroke / 2;

// Children inherit the dash, so every layer drawn with pathLength={100} sweeps together.
const PROGRESS_STYLE = { "--progress": 0, strokeDasharray: "var(--progress) 100" } as CSSProperties;
const SIGN = DIRECTION === "clockwise" ? 1 : -1;

// SVG circles start at 3 o'clock: rotate to 12, and mirror for counter-clockwise.
const FILL_TRANSFORM = `rotate(-90 ${C} ${C})${SIGN < 0 ? ` scale(1 -1) translate(0 ${-RING.size})` : ""}`;
// Inverse of FILL_TRANSFORM, so the fill's gradients stay lit from the top.
const FILL_GRADIENT_TRANSFORM = `${SIGN < 0 ? `translate(0 ${RING.size}) scale(1 -1) ` : ""}rotate(90 ${C} ${C})`;

const dots = Array.from({ length: RING.dots.count }, (_, i) => {
  const deg = RING.dots.startDeg + (360 / RING.dots.count) * i;
  const rad = (deg * Math.PI) / 180;
  return {
    cx: C + RING.dots.radius * Math.cos(rad),
    cy: C + RING.dots.radius * Math.sin(rad),
    // Point in the sweep (0–1, measured from 12 o'clock) at which this dot fills.
    at: (((((deg + 90) * SIGN) % 360) + 360) % 360) / 360,
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

/** Figma "checkmark-icon" (582:898), drawn on a 16×16 grid, with its fill bound to --brand. */
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
  const surfaceRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGGElement>(null);
  const id = useId();
  const ids = {
    track: `${id}track`,
    fill: `${id}fill`,
    rim: `${id}rim`,
    shadow: `${id}shadow`,
    feather: `${id}feather`,
    inner: `${id}inner`,
  };
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const checkDots = useMemo(() => new Set(middleDots(steps.length)), [steps.length]);

  const step = useStepTimeline({
    stepCount: steps.length,
    ...timing,
    onFrame: ({ progress, fillOpacity }) => {
      // Surface and arc share one progress value and fade out together on reset.
      for (const el of [surfaceRef.current, arcRef.current]) {
        el?.style.setProperty("--progress", `${progress * 100}`);
        el?.style.setProperty("opacity", `${fillOpacity}`);
      }
      dots.forEach((dot, i) => {
        dotRefs.current[i]?.toggleAttribute("data-filled", fillOpacity === 1 && progress >= dot.at);
      });
    },
  });

  return (
    <div className={`relative aspect-square ${className}`}>
      <svg
        aria-hidden
        viewBox={`0 0 ${RING.size} ${RING.size}`}
        className={`${styles.ring} absolute inset-0 size-full overflow-visible`}
      >
        <defs>
          <linearGradient id={ids.track} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={RING.size}>
            <stop offset={0} className={styles.trackTop} />
            <stop offset={0.5} className={styles.trackMid} />
            <stop offset={1} className={styles.trackBottom} />
          </linearGradient>
          <linearGradient
            id={ids.fill}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={0}
            y2={RING.size}
            gradientTransform={FILL_GRADIENT_TRANSFORM}
          >
            <stop offset={0} className={styles.fillLight} />
            <stop offset={0.45} className={styles.fillBase} />
            <stop offset={1} className={styles.fillDeep} />
          </linearGradient>
          <linearGradient
            id={ids.rim}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={0}
            y2={RING.size * 0.6}
            gradientTransform={FILL_GRADIENT_TRANSFORM}
          >
            <stop offset={0} className={styles.rimTop} />
            <stop offset={1} className={styles.rimBottom} />
          </linearGradient>
          {/* Feathers the wedge's edges so the tint fades in instead of a hard line. */}
          <filter id={ids.feather} filterUnits="userSpaceOnUse" x={0} y={0} width={RING.size} height={RING.size}>
            <feGaussianBlur stdDeviation={RING.surfaceFeather} />
          </filter>
          <clipPath id={ids.inner}>
            <circle cx={C} cy={C} r={INNER_R} />
          </clipPath>
          <filter id={ids.shadow} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx={0} dy={2} stdDeviation={2.5} className={styles.shadow} />
          </filter>
        </defs>

        {/* Clip applies after the blur, keeping the feathered tint inside the track. */}
        <g ref={surfaceRef} style={PROGRESS_STYLE} filter={`url(#${ids.feather})`} clipPath={`url(#${ids.inner})`}>
          {/* Inner surface: a pie wedge (stroke as wide as the radius) sweeping with the arc. */}
          <circle
            cx={C}
            cy={C}
            r={INNER_R / 2}
            fill="none"
            strokeWidth={INNER_R}
            pathLength={100}
            transform={FILL_TRANSFORM}
            className={styles.surface}
          />
        </g>

        <circle cx={C} cy={C} r={RING_R} fill="none" stroke={`url(#${ids.track})`} strokeWidth={RING.stroke} />

        {/* Shadow on an unrotated wrapper so it always falls downward. */}
        <g filter={`url(#${ids.shadow})`}>
          <g ref={arcRef} transform={FILL_TRANSFORM} style={PROGRESS_STYLE}>
            <circle
              cx={C}
              cy={C}
              r={RING_R}
              fill="none"
              stroke={`url(#${ids.fill})`}
              strokeWidth={RING.stroke}
              pathLength={100}
            />
            {/* Rim highlight along the outer edge. */}
            <circle
              cx={C}
              cy={C}
              r={RING_R + RING.stroke / 2 - 0.75}
              fill="none"
              stroke={`url(#${ids.rim})`}
              strokeWidth={1.5}
              pathLength={100}
            />
          </g>
        </g>

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
              <g
                filter={`url(#${ids.shadow})`}
                className="scale-0 opacity-0 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform-box:fill-box] origin-center group-data-filled:scale-100 group-data-filled:opacity-100 group-data-filled:duration-500"
              >
                <Checkmark x={d.cx} y={d.cy} size={RING.dots.checkSize} />
              </g>
            )}
          </g>
        ))}
      </svg>

      <StepLabel
        labels={steps}
        active={step}
        className="absolute inset-0 text-[16px] font-medium tracking-[-0.5px] whitespace-nowrap text-navy-900"
      />
    </div>
  );
}
