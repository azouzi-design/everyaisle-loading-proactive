import { LockScreen } from "@/components/LockScreen";

export default function Home() {
  return (
    <main className="flex h-dvh flex-1 items-center justify-center overflow-hidden px-4 py-6">
      <div className="phone-fit">
        <LockScreen />
      </div>
    </main>
  );
}
