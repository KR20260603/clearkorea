import { AppDock } from "@/components/app/app-dock";
import { SignOutButton } from "@/components/app/sign-out-button";
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

      <ShellFrame endSlot={<SignOutButton />}>
        <h1 className="sr-only">Square</h1>
        <SpeakUpComposer />

        <SquareFeed voices={feedVoices} />

        <AppDock activeHref="/" />
      </ShellFrame>
    </main>
  );
}
