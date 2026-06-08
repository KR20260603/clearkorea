import { AppDock } from "@/components/app/app-dock";
import { SignOutButton } from "@/components/app/sign-out-button";
import { StationsBoard } from "@/components/app/stations-board";
import { affectedStationsDisclaimer } from "@/lib/copy/copy";
import {
  AFFECTED_STATIONS,
  AFFECTED_STATIONS_SUMMARY,
  AFFECTED_STATIONS_UPDATED_AT,
} from "@/data/affected-stations";
import { SEVERITY_META } from "@/lib/stations/stations";
import { ShellFrame } from "@/app/shell-frame";

const stats = [
  { value: AFFECTED_STATIONS_SUMMARY.confirmed, label: "Confirmed shortages", accent: false },
  { value: AFFECTED_STATIONS_SUMMARY.halted, label: "Voting halted", accent: true },
  { value: AFFECTED_STATIONS_SUMMARY.regionCount, label: "Affected regions", accent: false },
] as const;

export default function StationsPage() {
  return (
    <main className="isolate relative flex h-svh flex-col overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_-10%,rgba(0,71,160,0.16),transparent_60%),radial-gradient(circle_at_-10%_110%,rgba(230,57,70,0.12),transparent_55%)]" />

      <ShellFrame endSlot={<SignOutButton />}>
        <header className="shrink-0">
          <p className="text-[clamp(0.58rem,1.35svh,0.7rem)] font-semibold uppercase tracking-[0.28em] text-zinc-400">
            Affected polling stations
          </p>
          <h1 className="mt-1 text-[clamp(1.05rem,2.6svh,1.4rem)] font-black leading-tight text-white">
            투표용지 <span className="text-civic-red">부족</span> 투표소
          </h1>
          <p className="mt-1 text-[clamp(0.62rem,1.45svh,0.76rem)] text-zinc-400">
            Updated {AFFECTED_STATIONS_UPDATED_AT} · more added as they are confirmed
          </p>

          <div className="mt-[clamp(0.625rem,1.8svh,1rem)] grid grid-cols-3 gap-[clamp(0.5rem,1.6vw,0.75rem)]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-[clamp(0.5rem,1.6vw,0.875rem)] py-[clamp(0.5rem,1.6svh,0.75rem)]"
              >
                <p
                  className="text-[clamp(1.1rem,3.2svh,1.75rem)] font-black leading-none"
                  style={stat.accent ? { color: SEVERITY_META.red.color } : undefined}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[clamp(0.54rem,1.25svh,0.66rem)] text-zinc-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-[clamp(0.56rem,1.3svh,0.68rem)] text-zinc-500">
            {AFFECTED_STATIONS_SUMMARY.regions}
          </p>
        </header>

        <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col">
          <StationsBoard stations={AFFECTED_STATIONS} />
        </div>

        <footer className="shrink-0 border-t border-white/8 pt-2">
          <p className="text-[clamp(0.56rem,1.3svh,0.7rem)] leading-[1.5] text-zinc-500">
            {affectedStationsDisclaimer.en}
          </p>
          <p className="mt-0.5 text-[clamp(0.54rem,1.25svh,0.66rem)] leading-[1.5] text-zinc-600">
            {affectedStationsDisclaimer.ko}
          </p>
        </footer>

        <AppDock activeHref="/stations" />
      </ShellFrame>
    </main>
  );
}
