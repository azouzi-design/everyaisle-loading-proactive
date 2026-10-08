import { PhoneFrame } from "@/components/PhoneFrame";
import { LoadingScreen } from "@/components/smartmeals-loading";

export default function Home() {
  return (
    <main className="flex h-dvh flex-1 items-center justify-center overflow-hidden p-4">
      <div className="phone-fit">
        <PhoneFrame>
          <LoadingScreen />
        </PhoneFrame>
      </div>
    </main>
  );
}
