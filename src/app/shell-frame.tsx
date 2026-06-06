import Image from "next/image";
import type { ReactNode } from "react";

export function BrandMark() {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <Image
        src="/pwa-icon.svg"
        alt=""
        width={34}
        height={34}
        priority
        className="h-[clamp(1.75rem,5svh,2.125rem)] w-[clamp(1.75rem,5svh,2.125rem)]"
      />
      <span className="text-sm font-black tracking-[0.22em] text-white">
        ClearKorea
      </span>
    </div>
  );
}

export function ShellFrame({
  children,
  endSlot,
}: {
  children: ReactNode;
  endSlot?: ReactNode;
}) {
  return (
    <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[1180px] flex-col">
      <header className="flex min-h-[clamp(2.5rem,8svh,3rem)] shrink-0 items-center justify-between gap-4">
        <BrandMark />
        <div className="flex h-[clamp(2.5rem,8svh,3rem)] w-[clamp(2.5rem,8svh,3rem)] items-center justify-end">
          {endSlot}
        </div>
      </header>
      {children}
    </div>
  );
}
