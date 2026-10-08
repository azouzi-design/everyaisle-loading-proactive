"use client";

import { useEffect, useRef, useState } from "react";

export type TimelineFrame = {
  /** 0 → 1 across all steps. Stays at 1 during the reset phase. */
  progress: number;
  /** 1 normally; fades 1 → 0 during the reset phase. */
  fillOpacity: number;
};

type Options = {
  stepCount: number;
  fill: number;
  hold: number;
  reset: number;
  /** Called every animation frame. Write to the DOM directly here; don't set state. */
  onFrame: (frame: TimelineFrame) => void;
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Looping step timeline driven by requestAnimationFrame.
 * Returns the active step index (re-renders only when the step changes).
 */
export function useStepTimeline({ stepCount, fill, hold, reset, onFrame }: Options) {
  const [step, setStep] = useState(0);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepMs = fill + hold;
    const stepsMs = stepCount * stepMs;
    const cycleMs = stepsMs + reset;

    let elapsed = 0;
    let last = performance.now();
    let current = 0;
    let frame = 0;

    const tick = (now: number) => {
      // Cap the delta so a backgrounded tab resumes where it left off.
      elapsed = (elapsed + Math.min(now - last, 100)) % cycleMs;
      last = now;

      const resetting = elapsed >= stepsMs;
      const index = resetting ? stepCount - 1 : Math.floor(elapsed / stepMs);
      const local = (elapsed - index * stepMs) / fill;
      const stepFill = reduceMotion ? 1 : easeInOutCubic(Math.min(local, 1));

      onFrameRef.current({
        progress: resetting ? 1 : (index + stepFill) / stepCount,
        fillOpacity: resetting ? 1 - (elapsed - stepsMs) / reset : 1,
      });

      // The first label returns as the fill fades out.
      const next = resetting ? 0 : index;
      if (next !== current) {
        current = next;
        setStep(next);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stepCount, fill, hold, reset]);

  return step;
}
