import { BrandDemo } from "@/components/BrandDemo";
import { PhoneFrame } from "@/components/PhoneFrame";
import { LoadingScreen } from "@/components/smartmeals-loading";

export default function Home() {
  return (
    <BrandDemo>
      <PhoneFrame>
        <LoadingScreen />
      </PhoneFrame>
    </BrandDemo>
  );
}
