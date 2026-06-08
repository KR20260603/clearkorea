import { Megaphone, Newspaper, Quote, Vote } from "lucide-react";
import Link from "next/link";
import { AppDock } from "@/components/app/app-dock";
import { SignOutButton } from "@/components/app/sign-out-button";
import { CountersBar } from "@/components/app/counters-bar";
import { TodayClock } from "@/components/app/today-clock";
import { seoulCongestionDisclaimer } from "@/lib/copy/copy";
import { emptyCountersSnapshot } from "@/lib/counters/counters";
import { ShellFrame } from "@/app/shell-frame";

const highlights = [
  {
    icon: Quote,
    title: "Top voices today",
    body: "The most-shared lawful testimonies from the current KST day rise here.",
  },
  {
    icon: Newspaper,
    title: "World press today",
    body: "Foreign coverage gathered for today's election-transparency summary.",
  },
  {
    icon: Megaphone,
    title: "Verified posts today",
    body: "Statements reviewed before they appear, scoped to today's summary.",
  },
] as const;

export default function TodayPage() {
  return (
    <main className="isolate relative flex h-svh flex-col overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,71,160,0.16),transparent_55%)]" />

      <ShellFrame endSlot={<SignOutButton />}>
        <TodayClock initialIso={new Date().toISOString()} />

        <CountersBar initial={emptyCountersSnapshot} />

        <div className="mt-[clamp(0.75rem,2svh,1.25rem)] flex min-h-0 flex-1 flex-col gap-[clamp(0.75rem,2svh,1.25rem)] overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
          <section
            aria-label="Today's regional real-time congestion"
            className="shrink-0 rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]"
          >
            <p className="text-[clamp(0.62rem,1.5svh,0.78rem)] font-bold uppercase tracking-[0.18em] text-zinc-300">
              Regional real-time congestion today
            </p>
            <p className="mt-2 text-[clamp(0.72rem,1.7svh,0.95rem)] leading-[1.45] text-zinc-200">
              {seoulCongestionDisclaimer.en}
            </p>
            <p className="mt-1 text-[clamp(0.68rem,1.55svh,0.875rem)] leading-[1.45] text-zinc-400">
              {seoulCongestionDisclaimer.ko}
            </p>
          </section>

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
            aria-label="Today's highlights"
            className="grid shrink-0 gap-[clamp(0.625rem,1.8svh,1rem)] sm:grid-cols-3"
          >
            {highlights.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]"
              >
                <Icon aria-hidden="true" className="h-5 w-5 text-civic-red" />
                <h2 className="mt-2 text-[clamp(0.9rem,2svh,1.0625rem)] font-bold text-white">
                  {title}
                </h2>
                <p className="mt-1 text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.45] text-zinc-400">
                  {body}
                </p>
              </article>
            ))}
          </section>
        </div>

        <AppDock activeHref="/today" />
      </ShellFrame>
    </main>
  );
}
