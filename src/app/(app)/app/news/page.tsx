import { AppDock } from "@/components/app/app-dock";
import { NewsTabs } from "@/components/app/news-tabs";
import { ReportPostModal } from "@/components/app/report-post-modal";
import {
  PUBLIC_POST_SEED,
  VERIFIED_POST_SEED,
  WORLD_PRESS_SEED,
} from "@/data/news";
import { ShellFrame } from "@/app/shell-frame";

export default function NewsPage() {
  return (
    <main className="isolate relative flex h-svh flex-col overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,71,160,0.16),transparent_55%)]" />

      <ShellFrame endSlot={<ReportPostModal />}>
        <header className="shrink-0">
          <h1 className="text-[clamp(1rem,2.4svh,1.25rem)] font-bold text-white">News</h1>
          <p className="mt-1 text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.45] text-zinc-400">
            Verified statements, citizen posts, and foreign coverage in one timeline.
          </p>
        </header>

        <div className="mt-[clamp(0.625rem,1.8svh,1rem)] flex min-h-0 flex-1 flex-col">
          <NewsTabs
            verified={VERIFIED_POST_SEED}
            publicPosts={PUBLIC_POST_SEED}
            worldPress={WORLD_PRESS_SEED}
          />
        </div>

        <AppDock activeHref="/app/news" />
      </ShellFrame>
    </main>
  );
}
