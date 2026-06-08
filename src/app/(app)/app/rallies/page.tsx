import { CircleUserRound, Gauge, HeartHandshake, MapPin, Vote } from "lucide-react";
import Link from "next/link";
import { AppDock } from "@/components/app/app-dock";
import { RalliesMap } from "@/components/app/rallies-map";
import {
  ralliesIntro,
  rallyCongestionPending,
  rallySupportGuide,
  seoulCongestionDisclaimer,
} from "@/lib/copy/copy";
import { isSeoulRally, visibleRallies } from "@/lib/rallies/rallies";
import { RALLY_SEED } from "@/data/rallies";
import { ShellFrame } from "@/app/shell-frame";

const statusBadge: Record<"active" | "planned", { label: string; className: string }> = {
  active: { label: "Live now", className: "bg-civic-red/20 text-civic-red" },
  planned: { label: "Upcoming", className: "bg-civic-blue/20 text-sky-300" },
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
});

export default function RalliesPage() {
  const rallies = visibleRallies(RALLY_SEED);

  return (
    <main className="isolate relative flex h-svh flex-col overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,71,160,0.16),transparent_55%)]" />

      <ShellFrame
        endSlot={
          <Link
            href="/auth/start"
            className="inline-flex h-[clamp(2.25rem,7svh,2.75rem)] items-center justify-center rounded-full border border-white/20 bg-black/30 px-4 text-[clamp(0.7rem,1.7svh,0.875rem)] font-semibold text-white transition hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <CircleUserRound aria-hidden="true" className="mr-1.5 h-4 w-4" />
            Log in
          </Link>
        }
      >
        <header className="shrink-0">
          <h1 className="text-[clamp(1rem,2.4svh,1.25rem)] font-bold text-white">
            Rallies
          </h1>
          <p className="mt-1 text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.45] text-zinc-400">
            {ralliesIntro.en}
          </p>
        </header>

        <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col gap-[clamp(0.625rem,1.8svh,1rem)] overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
          <RalliesMap rallies={rallies} />

          <Link
            href="/stations"
            className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.75rem,2.2vw,1rem)] transition hover:border-white/30"
          >
            <Vote aria-hidden="true" className="h-5 w-5 shrink-0 text-civic-red" />
            <span className="min-w-0">
              <span className="block text-[clamp(0.8rem,1.85svh,0.95rem)] font-bold text-white">
                Affected polling stations
              </span>
              <span className="block text-[clamp(0.66rem,1.5svh,0.8125rem)] text-zinc-400">
                See the ballot-shortage board · 투표용지 부족 투표소
              </span>
            </span>
            <span className="ml-auto shrink-0 text-zinc-500 transition group-hover:text-white" aria-hidden="true">
              →
            </span>
          </Link>

          <section
            aria-label="Regional real-time congestion"
            className="shrink-0 rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]"
          >
            <p className="flex items-center gap-1.5 text-[clamp(0.6rem,1.45svh,0.74rem)] font-bold uppercase tracking-[0.16em] text-zinc-300">
              <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
              Regional real-time congestion
            </p>
            <p className="mt-2 text-[clamp(0.72rem,1.7svh,0.9rem)] leading-[1.45] text-zinc-200">
              {rallyCongestionPending.en}
            </p>
            <p className="mt-1 text-[clamp(0.68rem,1.55svh,0.85rem)] leading-[1.45] text-zinc-400">
              {seoulCongestionDisclaimer.en}
            </p>
            <p className="mt-1 text-[clamp(0.66rem,1.5svh,0.82rem)] leading-[1.45] text-zinc-500">
              {seoulCongestionDisclaimer.ko}
            </p>
          </section>

          <section aria-label="Rally list" className="shrink-0 grid gap-[clamp(0.5rem,1.5svh,0.875rem)]">
            {rallies.map((rally) => {
              const badge = statusBadge[rally.status as "active" | "planned"];
              return (
                <article
                  key={rally.id}
                  className="rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 text-[clamp(0.85rem,1.95svh,1.0625rem)] font-bold text-white">
                      {rally.title}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[clamp(0.58rem,1.35svh,0.7rem)] font-bold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[clamp(0.7rem,1.6svh,0.875rem)] text-zinc-300">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                    <span className="min-w-0 truncate">{rally.location}</span>
                  </p>
                  <p className="mt-1 text-[clamp(0.66rem,1.5svh,0.82rem)] text-zinc-400">
                    {timeFormatter.format(new Date(rally.startAt))} KST
                    {isSeoulRally(rally) ? null : " · admin/crowdsourced"}
                  </p>
                </article>
              );
            })}
          </section>

          <section
            aria-label="Support guide"
            className="shrink-0 rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]"
          >
            <h2 className="flex items-center gap-1.5 text-[clamp(0.85rem,1.95svh,1.0625rem)] font-bold text-white">
              <HeartHandshake aria-hidden="true" className="h-4 w-4 text-civic-red" />
              Support guide
            </h2>
            <ul className="mt-2 grid gap-2">
              {rallySupportGuide.map((step) => (
                <li
                  key={step.en}
                  className="rounded-xl border border-white/8 bg-black/30 p-2.5"
                >
                  <p className="text-[clamp(0.72rem,1.65svh,0.875rem)] leading-[1.45] text-zinc-200">
                    {step.en}
                  </p>
                  <p className="mt-0.5 text-[clamp(0.66rem,1.5svh,0.8125rem)] leading-[1.45] text-zinc-500">
                    {step.ko}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <AppDock activeHref="/rallies" />
      </ShellFrame>
    </main>
  );
}
