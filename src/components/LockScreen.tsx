import Image from "next/image";

// Figma: Every Aisle — Branding, node 581:807 ("LockScreen").
// Fixed 390×844 device frame; children are positioned in frame coordinates.

const DOT_COUNT = 22;
const DOT_RADIUS = 147;
const DOT_START_DEG = -96.3;

const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
  const angle = ((DOT_START_DEG + (360 / DOT_COUNT) * i) * Math.PI) / 180;
  return {
    cx: +(150 + DOT_RADIUS * Math.cos(angle)).toFixed(2),
    cy: +(150 + DOT_RADIUS * Math.sin(angle)).toFixed(2),
  };
});

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

        {/* Loader */}
        <div className="absolute left-[28px] top-[440px] size-[334px]">
          <Image src="/figma/ring-track.svg" alt="" width={334} height={334} className="absolute inset-0" />
          <Image src="/figma/ring-arc.svg" alt="" width={167} height={177.972} className="absolute left-0 top-0" />
        </div>
        <svg
          aria-hidden
          width={300}
          height={300}
          viewBox="0 0 300 300"
          className="absolute left-[45px] top-[458.83px]"
        >
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={2.5} fill="#CFD4DC" />
          ))}
        </svg>
        <p className="absolute left-1/2 top-[598px] -translate-x-1/2 whitespace-nowrap text-[16px] tracking-[-0.5px] text-navy-700">
          Logging you into SmartMeals..
        </p>
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
