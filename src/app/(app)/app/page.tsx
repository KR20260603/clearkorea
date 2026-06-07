import { CircleUserRound, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { AppDock } from "@/components/app/app-dock";
import { SpeakUpComposer } from "@/components/app/speak-up-composer";
import { bilingualCopy } from "@/lib/copy/copy";
import { ShellFrame } from "@/app/shell-frame";

const sortTabs = [
  { id: "latest", label: "Latest" },
  { id: "7d", label: "7d" },
  { id: "1d", label: "1d" },
  { id: "12h", label: "12h" },
  { id: "1h", label: "1h" },
] as const;

export default function SquarePage() {
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
        <SpeakUpComposer />

        <div
          role="tablist"
          aria-label="Feed sorting"
          className="mt-[clamp(0.625rem,1.8svh,1rem)] flex shrink-0 gap-1.5 overflow-x-auto"
        >
          {sortTabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={index === 0}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[clamp(0.7rem,1.7svh,0.875rem)] font-semibold transition ${
                index === 0
                  ? "bg-white/12 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
          <div
            data-testid="square-empty"
            className="grid flex-1 place-content-center gap-2 rounded-2xl border border-dashed border-white/12 bg-black/20 px-6 py-[clamp(1.5rem,6svh,3rem)] text-center"
          >
            <MessagesSquare
              aria-hidden="true"
              className="mx-auto h-8 w-8 text-zinc-500"
            />
            <p className="text-[clamp(0.8rem,1.9svh,1rem)] font-semibold text-zinc-200">
              {bilingualCopy.squareEmpty.en}
            </p>
            <p className="text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.45] text-zinc-400">
              {bilingualCopy.squareEmpty.ko}
            </p>
          </div>
        </div>

        <AppDock activeHref="/app" />
      </ShellFrame>
    </main>
  );
}
