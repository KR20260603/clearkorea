"use client";

import { useEffect, useState } from "react";

const kstDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const kstTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function TodayClock({ initialIso }: { initialIso: string }) {
  const [now, setNow] = useState(() => new Date(initialIso));

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-label="Current KST date and time"
      className="mb-[clamp(0.625rem,1.8svh,1rem)] flex shrink-0 items-end justify-between gap-3"
    >
      <p className="text-[clamp(1.2rem,3.4svh,2rem)] font-black leading-none tabular-nums text-white">
        {kstDateFormatter.format(now)}
      </p>
      <p className="text-right text-[clamp(0.72rem,1.8svh,0.9375rem)] font-bold leading-none tabular-nums text-civic-blue">
        {kstTimeFormatter.format(now)}
        <span className="ml-1 text-[clamp(0.55rem,1.35svh,0.7rem)] uppercase tracking-[0.18em] text-zinc-500">
          KST
        </span>
      </p>
    </div>
  );
}
