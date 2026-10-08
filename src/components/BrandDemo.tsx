"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { BRAND_COLORS, ColorPicker } from "./ColorPicker";

/** Demo shell: centers the phone and lets viewers re-theme it via --brand. */
export function BrandDemo({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<string>(BRAND_COLORS[0].value);

  return (
    <main
      style={{ "--brand": brand } as CSSProperties}
      className="brand-transition flex h-dvh flex-1 items-center justify-center overflow-hidden p-4"
    >
      <div className="phone-fit">{children}</div>
      <ColorPicker value={brand} onChange={setBrand} className="fixed bottom-[12px] left-1/2 -translate-x-1/2" />
    </main>
  );
}
