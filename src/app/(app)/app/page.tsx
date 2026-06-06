import {
  CircleUserRound,
  Home,
  Megaphone,
  Newspaper,
  RadioTower,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { dockLabels } from "../../../lib/copy/copy";
import { ShellFrame } from "../../shell-frame";

const dockItems = [
  { label: dockLabels[0], icon: Home },
  { label: dockLabels[1], icon: Megaphone },
  { label: dockLabels[2], icon: UsersRound },
  { label: dockLabels[3], icon: RadioTower },
  { label: dockLabels[4], icon: Newspaper },
] as const;

export default function AppHomePage() {
  return (
    <main className="isolate relative h-svh overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div
        aria-hidden="true"
        data-testid="app-hero-background"
        className="absolute inset-0 -z-20 bg-[image:url('/tile.png')] bg-cover bg-center opacity-95"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.24)_0%,rgba(10,10,10,0.62)_42%,rgba(10,10,10,0.82)_100%)]" />

      <ShellFrame
        endSlot={
          <span className="inline-flex h-[clamp(2.5rem,8svh,3rem)] w-[clamp(2.5rem,8svh,3rem)] items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.12),rgba(10,10,10,0.28)_58%)] text-white shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]">
            <CircleUserRound aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Preview</span>
          </span>
        }
      >

        <section className="grid min-h-0 flex-1 items-center gap-[clamp(0.625rem,2.4svh,2rem)] py-[clamp(0.5rem,2svh,1.5rem)] lg:grid-cols-[minmax(0,720px)_minmax(320px,420px)] lg:gap-12">
          <div className="min-w-0">
            <p className="mb-[clamp(0.375rem,1.4svh,1rem)] inline-flex rounded-full border border-white/15 bg-black/20 px-4 py-1.5 text-[clamp(0.68rem,1.65svh,0.875rem)] font-semibold text-zinc-200">
              Development preview
            </p>
            <h1
              aria-label="ClearKorea app shell"
              className="text-[clamp(1.75rem,min(9svh,12vw),5.2rem)] font-black leading-[0.95] text-white"
            >
              <span aria-hidden="true">
                ClearKorea
                <br />
                app shell
              </span>
            </h1>
            <p className="mt-[clamp(0.5rem,1.8svh,1.25rem)] max-w-2xl text-[clamp(0.78rem,1.85svh,1.125rem)] leading-[1.5] text-zinc-200">
              The five-tab civic app shell is ready for v1 implementation.
            </p>
          </div>

          <aside
            aria-label="App readiness"
            className="bg-black/20 min-w-0 border-l border-white/20 py-[clamp(0.375rem,1.4svh,1rem)] pl-5 pr-4 font-serif text-zinc-100 backdrop-blur-[0.5px]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-civic-red">
              Status
            </p>
            <h2 className="mt-[clamp(0.375rem,1.4svh,0.75rem)] text-[clamp(0.95rem,2.6svh,1.5rem)] font-black leading-tight text-white">
              같은 구조, 같은 배경, 같은 기록의 톤으로 앱 안까지 이어진다.
            </h2>
            <p className="mt-[clamp(0.375rem,1.35svh,1rem)] text-[clamp(0.66rem,1.55svh,0.875rem)] leading-[1.45] text-zinc-300">
              첫 화면과 앱 쉘은 같은 시각 언어를 공유한다. 시민의 목소리,
              집회, 광장, 라이브, 뉴스는 모두 한 기록 체계 안에서 이어진다.
            </p>
            <p className="mt-[clamp(0.375rem,1.5svh,1rem)] inline-flex items-center gap-2 text-[clamp(0.68rem,1.65svh,0.875rem)] font-bold text-zinc-100">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-civic-blue" />
              Five public sections are staged for implementation.
            </p>
          </aside>
        </section>

        <nav
          aria-label="Primary app sections"
          className="grid w-full shrink-0 grid-cols-5 overflow-hidden rounded-full border border-white/15 bg-black/30 p-1"
        >
          {dockItems.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="flex min-h-[clamp(2rem,6svh,2.75rem)] items-center justify-center gap-[clamp(0.125rem,1vw,0.5rem)] rounded-full px-1 text-[clamp(0.5rem,2.4vw,0.875rem)] font-semibold text-zinc-200"
            >
              <Icon aria-hidden="true" className="h-[clamp(0.7rem,3vw,1rem)] w-[clamp(0.7rem,3vw,1rem)]" />
              {label}
            </span>
          ))}
        </nav>
      </ShellFrame>
    </main>
  );
}
