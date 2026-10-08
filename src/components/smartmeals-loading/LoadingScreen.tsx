import { BrandPanel } from "./BrandPanel";
import { LoadingRing } from "./LoadingRing";

/**
 * The SmartMeals loading screen (Figma node 581:807), designed at 390×844.
 * Fills its parent; the ring stays centered in the space below the brand panel.
 */
export function LoadingScreen() {
  return (
    <div className="flex size-full flex-col bg-white p-[5px]">
      <BrandPanel className="h-[366px] shrink-0" />
      <div className="flex flex-1 items-center justify-center">
        <LoadingRing className="w-[334px]" />
      </div>
    </div>
  );
}
