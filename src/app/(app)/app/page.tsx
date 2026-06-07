import { CircleUserRound, Megaphone, Newspaper, Quote } from "lucide-react";
import Link from "next/link";
import { AppDock } from "@/components/app/app-dock";
import { CountersBar } from "@/components/app/counters-bar";
import { seoulCongestionDisclaimer } from "@/lib/copy/copy";
import { emptyCountersSnapshot } from "@/lib/counters/counters";
import { ShellFrame } from "@/app/shell-frame";

const highlights = [
  {
    icon: Quote,
    title: "Top voices",
    body: "The most-shared lawful testimonies rise here as the square fills.",
  },
  {
    icon: Newspaper,
    title: "World press",
    body: "Foreign coverage of the election-transparency movement, headline only.",
  },
  {
    icon: Megaphone,
    title: "Verified posts",
    body: "Statements from public and semi-public figures, reviewed before they appear.",
  },
] as const;

export default function AppHomePage() {
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
        <CountersBar initial={emptyCountersSnapshot} />

        <div className="mt-[clamp(0.75rem,2svh,1.25rem)] flex min-h-0 flex-1 flex-col gap-[clamp(0.75rem,2svh,1.25rem)] overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
          <section
            aria-label="Regional real-time congestion"
            className="shrink-0 rounded-2xl border border-white/12 bg-black/25 p-[clamp(0.875rem,2.5vw,1.25rem)]"
          >
            <p className="text-[clamp(0.62rem,1.5svh,0.78rem)] font-bold uppercase tracking-[0.18em] text-zinc-300">
              Regional real-time congestion
            </p>
            <p className="mt-2 text-[clamp(0.72rem,1.7svh,0.95rem)] leading-[1.45] text-zinc-200">
              {seoulCongestionDisclaimer.en}
            </p>
            <p className="mt-1 text-[clamp(0.68rem,1.55svh,0.875rem)] leading-[1.45] text-zinc-400">
              {seoulCongestionDisclaimer.ko}
            </p>
          </section>

          <section
            aria-label="Highlights"
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

        <AppDock activeHref="/app" />
      </ShellFrame>
    </main>
  );
}
