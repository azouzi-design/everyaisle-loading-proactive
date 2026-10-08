"use client";

// Demo-only palette from the Every Aisle brand library (Figma node 582:910).
export const BRAND_COLORS = [
  { name: "Navy", value: "#102A50" },
  { name: "Bright aqua", value: "#61C5E5" },
  { name: "Creator teal", value: "#178FAE" },
  { name: "Citrus gold", value: "#F4B642" },
] as const;

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ColorPicker({ value, onChange, className = "" }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Primary color"
      className={`flex items-center gap-[4px] rounded-[16px] border border-[#e8e8e8] bg-white py-[4px] pl-[12px] pr-[4px] ${className}`}
    >
      <p className="w-[74px] shrink-0 text-[12px] text-black">Pick color:</p>
      {BRAND_COLORS.map((color) => {
        const selected = color.value === value;
        return (
          <button
            key={color.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={color.name}
            title={color.name}
            onClick={() => onChange(color.value)}
            style={{ backgroundColor: color.value }}
            className={`size-[38px] shrink-0 cursor-pointer rounded-[12px] transition-[box-shadow,scale] duration-200 ease-out outline-offset-2 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-[#102a50] active:scale-95 ${
              selected ? "shadow-[inset_0_0_0_2px_#fff,inset_0_0_0_3px_rgb(0_0_0/0.08)]" : ""
            }`}
          />
        );
      })}
    </div>
  );
}
