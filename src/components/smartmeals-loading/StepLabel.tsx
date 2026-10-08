"use client";

import { useState } from "react";

import styles from "./StepLabel.module.css";

type Props = {
  labels: readonly string[];
  active: number;
  className?: string;
};

/** Stacks every label in one grid cell and swaps them with a shared-axis-Z transition. */
export function StepLabel({ labels, active, className = "" }: Props) {
  // Remember which label just left so it can play its exit.
  const [previous, setPrevious] = useState(active);
  const [exiting, setExiting] = useState(-1);
  if (previous !== active) {
    setExiting(previous);
    setPrevious(active);
  }

  return (
    <div className={`${styles.stack} ${className}`} role="status" aria-live="polite">
      {labels.map((label, i) => (
        <p
          key={label}
          aria-hidden={i !== active}
          data-state={i === active ? "active" : i === exiting ? "exiting" : "idle"}
          className={styles.label}
        >
          {label}
        </p>
      ))}
    </div>
  );
}
