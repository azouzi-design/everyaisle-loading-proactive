import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Demo-only iPhone chrome (status bar + home indicator) at 390×844.
 * Not part of the loading animation: in the app, render the screen directly.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white shadow-[0_32px_64px_-32px_rgb(16_42_80/0.18)]">
      {children}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44px]">
        <p className="absolute left-[15px] top-[13px] w-[32px] text-center font-ios text-[17px] font-semibold leading-[22px] tracking-[-0.408px] text-white">
          9:41
        </p>
        <Image src="/figma/signal.svg" alt="" width={18} height={12} className="absolute left-[295px] top-[19px]" />
        <Image src="/figma/wifi.svg" alt="" width={17} height={11.834} className="absolute left-[321px] top-[19px]" />
        <Image src="/figma/battery.svg" alt="" width={27.401} height={13} className="absolute left-[345px] top-[18px]" />
      </div>

      <div className="absolute bottom-[7px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#121212]" />
    </div>
  );
}
