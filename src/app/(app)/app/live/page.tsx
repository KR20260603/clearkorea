import { Radio } from "lucide-react";
import { AppDock } from "@/components/app/app-dock";
import { SignOutButton } from "@/components/app/sign-out-button";
import { StreamGrid } from "@/components/app/stream-grid";
import { liveStreams, replayStreams } from "@/lib/streams/streams";
import { STREAM_SEED } from "@/data/streams";
import { ShellFrame } from "@/app/shell-frame";

export default function LivePage() {
  const live = liveStreams(STREAM_SEED);
  const replays = replayStreams(STREAM_SEED);

  return (
    <main className="isolate relative flex h-svh flex-col overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,71,160,0.16),transparent_55%)]" />

      <ShellFrame endSlot={<SignOutButton />}>
        <header className="shrink-0">
          <h1 className="flex items-center gap-2 text-[clamp(1rem,2.4svh,1.25rem)] font-bold text-white">
            <Radio aria-hidden="true" className="h-5 w-5 text-civic-red" />
            Live
          </h1>
          <p className="mt-1 text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.45] text-zinc-400">
            Verified YouTube relays from the rallies. Ended broadcasts stay as replays.
          </p>
        </header>

        <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col gap-[clamp(0.75rem,2svh,1.25rem)] overflow-y-auto pb-[clamp(0.75rem,2svh,1.25rem)]">
          <StreamGrid title="Live now" streams={live} live emptyLabel="No verified relays are live right now." />
          <StreamGrid title="Replays" streams={replays} emptyLabel="No replays are archived yet." />
        </div>

        <AppDock activeHref="/live" />
      </ShellFrame>
    </main>
  );
}
