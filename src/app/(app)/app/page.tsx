import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { AppDock } from "@/components/app/app-dock";
import { SpeakUpComposer } from "@/components/app/speak-up-composer";
import { SquareFeed, type FeedVoice } from "@/components/app/square-feed";
import { attachVoiceAuthors } from "@/lib/voices/voice-author";
import { VOICE_SEED, VOICE_USERS } from "@/data/voices";
import { ShellFrame } from "@/app/shell-frame";

const feedVoices: FeedVoice[] = attachVoiceAuthors(VOICE_SEED, VOICE_USERS);

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
        <h1 className="sr-only">Square</h1>
        <SpeakUpComposer />

        <SquareFeed voices={feedVoices} />

        <AppDock activeHref="/app" />
      </ShellFrame>
    </main>
  );
}
