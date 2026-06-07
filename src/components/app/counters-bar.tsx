"use client";

import { useEffect, useState } from "react";
import { counterLabels } from "@/lib/copy/copy";
import type { CountersSnapshot } from "@/lib/counters/counters";

const POLL_INTERVAL_MS = 8000;
const numberFormatter = new Intl.NumberFormat("en-US");

export function CountersBar({ initial }: { initial: CountersSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial);

  useEffect(() => {
    let active = true;

    async function load() {
      const response = await fetch("/api/counters", { cache: "no-store" }).catch(
        () => null,
      );
      if (!response || !response.ok) {
        return;
      }
      const data = (await response.json().catch(() => null)) as CountersSnapshot | null;
      if (data && active) {
        setSnapshot(data);
      }
    }

    void load();
    const timer = setInterval(() => void load(), POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <dl className="grid shrink-0 grid-cols-2 gap-[clamp(0.5rem,2vw,1rem)]">
      <div
        data-testid="counter-participants"
        className="rounded-2xl border border-white/12 bg-black/30 px-[clamp(0.875rem,3vw,1.5rem)] py-[clamp(0.625rem,2svh,1rem)]"
      >
        <dt className="text-[clamp(0.6rem,1.5svh,0.75rem)] font-semibold uppercase tracking-[0.16em] text-civic-red">
          {counterLabels.participants}
        </dt>
        <dd className="mt-1 text-[clamp(1.5rem,6svh,2.75rem)] font-black leading-none tabular-nums text-white">
          {numberFormatter.format(snapshot.participants)}
        </dd>
      </div>
      <div
        data-testid="counter-voices"
        className="rounded-2xl border border-white/12 bg-black/30 px-[clamp(0.875rem,3vw,1.5rem)] py-[clamp(0.625rem,2svh,1rem)]"
      >
        <dt className="text-[clamp(0.6rem,1.5svh,0.75rem)] font-semibold uppercase tracking-[0.16em] text-civic-blue">
          {counterLabels.voices}
        </dt>
        <dd className="mt-1 text-[clamp(1.5rem,6svh,2.75rem)] font-black leading-none tabular-nums text-white">
          {numberFormatter.format(snapshot.voices)}
        </dd>
      </div>
    </dl>
  );
}
