import Image from "next/image";

import styles from "./BrandPanel.module.css";

/** Navy header with the SmartMeals lockup (Figma frame "Frame 390"). */
export function BrandPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.panel} flex flex-col items-center justify-center gap-[9px] ${className}`}>
      <Image src="/figma/smartmeals-wordmark.svg" alt="SmartMeals" width={165} height={68.3} priority className="relative" />
      <Image
        src="/figma/powered-by-everyaisle.svg"
        alt="Powered by Every Aisle"
        width={138.23}
        height={11.17}
        priority
        className="relative"
      />
    </div>
  );
}
