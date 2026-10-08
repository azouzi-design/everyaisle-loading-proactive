import Image from "next/image";

import { LoadingRing } from "./LoadingRing";

// Figma: Every Aisle — Branding, node 581:807 ("LockScreen").
// Fixed 390×844 device frame; children are positioned in frame coordinates.

export function LockScreen() {
  return (
    <div className="relative h-[844px] w-[390px] shrink-0 overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white">
      <div className="absolute inset-[-1px]">
        {/* Brand panel */}
        <div className="absolute left-[6px] top-[6px] h-[366px] w-[378px] rounded-[12px] bg-navy-900" />
        <Image
          src="/figma/smartmeals-wordmark.svg"
          alt="SmartMeals"
          width={165}
          height={68.3}
          priority
          className="absolute left-[112.09px] top-[164px] h-[68.3px] w-[165px]"
        />
        <Image
          src="/figma/powered-by-everyaisle.svg"
          alt="Powered by Every Aisle"
          width={138.23}
          height={11.17}
          priority
          className="absolute left-[125.56px] top-[241.3px] h-[11.17px] w-[138.23px]"
        />

        <LoadingRing />
      </div>

      {/* Status bar */}
      <div className="absolute inset-x-[-1px] top-[-1px] h-[44px]">
        <p className="absolute left-[16px] top-[14px] w-[32px] text-center font-ios text-[17px] font-semibold leading-[22px] tracking-[-0.408px] text-white">
          9:41
        </p>
        <Image src="/figma/signal.svg" alt="" width={18} height={12} className="absolute left-[296px] top-[20px]" />
        <Image src="/figma/wifi.svg" alt="" width={17} height={11.834} className="absolute left-[322px] top-[20px]" />
        <Image src="/figma/battery.svg" alt="" width={27.401} height={13} className="absolute left-[346px] top-[19px]" />
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-[7px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#121212]" />
    </div>
  );
}
