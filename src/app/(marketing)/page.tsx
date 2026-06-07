import { LogIn } from "lucide-react";
import { ShellFrame } from "../shell-frame";

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.46-.35-.19-.85-.66-.01-.67.79-.01 1.35.75 1.54 1.06.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.11.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.29 9.29 0 0 1 12 7.01c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.2 10.2 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export default function LandingPage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClearKorea",
    url: "https://clearkorea.com",
    sameAs: ["https://github.com/KR20260603/clearkorea"],
  };

  return (
    <main className="h-svh overflow-hidden bg-civic-bg text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <section className="isolate relative h-full overflow-hidden px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)]">
        <div
          aria-hidden="true"
          data-testid="landing-candle-field"
          className="absolute inset-0 z-0 bg-[image:url('/hero2.png')] bg-cover bg-center opacity-85"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-0 h-[56%] bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.05)_34%,rgba(10,10,10,0.22)_100%)]"
        />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.46)_34%,rgba(10,10,10,0.58)_66%,rgba(10,10,10,0.12)_100%)]" />

        <ShellFrame>
          <div className="grid min-h-0 flex-1 items-center gap-[clamp(0.625rem,2.4svh,2rem)] py-[clamp(0.5rem,2svh,1.5rem)] lg:grid-cols-[minmax(0,720px)_minmax(320px,420px)] lg:gap-12">
            <div className="min-w-0">
              <div className="max-w-[760px]">
                <h1
                  aria-label="Your voice, on the record."
                  className="text-[clamp(1.75rem,min(9svh,12vw),5.2rem)] font-black leading-[0.95] text-white"
                >
                  <span aria-hidden="true">
                    Your voice,
                    <br />
                    on the record.
                  </span>
                </h1>
                <p className="sr-only">
                  ClearKorea is an online square for lawful participation, rally
                  support, livestream aggregation, verified posts, and foreign
                  press tracking around Korean election transparency. Built for
                  full investigation, prevention of recurrence, election
                  transparency, and a fair re-vote.
                </p>
              </div>
              <div className="mt-[clamp(0.75rem,2.4svh,1.75rem)] flex flex-wrap items-center gap-[clamp(0.75rem,3vw,1.25rem)]">
                <a
                  href="/auth/start"
                  className="inline-flex min-h-[clamp(2.375rem,6svh,3rem)] min-w-[clamp(10.5rem,48vw,13.5rem)] rounded-full bg-gradient-to-r from-civic-red via-white to-civic-blue p-px text-[clamp(0.875rem,2.2svh,1.125rem)] font-bold text-white transition hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <span className="inline-flex min-h-[calc(100%-2px)] w-full items-center justify-center gap-2 rounded-full bg-civic-bg px-8">
                    <LogIn aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
                    Enter
                  </span>
                </a>
                <a
                  aria-label="GitHub"
                  href="https://github.com/KR20260603/clearkorea"
                  className="inline-flex h-[clamp(2.375rem,6svh,3rem)] w-[clamp(2.375rem,6svh,3rem)] items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.12),rgba(10,10,10,0.28)_58%)] text-white shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] transition hover:border-white/45 hover:bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.22),rgba(0,71,160,0.16)_42%,rgba(10,10,10,0.42)_76%)] hover:shadow-[0_0_28px_rgba(0,71,160,0.24),inset_0_0_18px_rgba(255,255,255,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <GitHubMark />
                </a>
              </div>
              <p className="mt-[clamp(0.5rem,1.6svh,1rem)] text-[clamp(0.62rem,1.4svh,0.78rem)] text-zinc-500">
                Open source · Licensed AGPL-3.0-only
              </p>
            </div>
            <aside
              aria-label="ClearKorea declaration"
              className="bg-black/20 min-w-0 border-l border-white/20 py-[clamp(0.375rem,1.4svh,1rem)] pl-5 pr-4 font-serif text-zinc-100 backdrop-blur-[0.5px]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-civic-red">
                Declaration
              </p>
              <h2 className="mt-[clamp(0.375rem,1.4svh,0.75rem)] text-[clamp(0.95rem,2.6svh,1.5rem)] font-black leading-tight text-white">
                기록되지 않은 의혹은 사라진다. 검증되지 않은 선거는 민주주의를
                침묵시킨다.
              </h2>
              <p className="mt-[clamp(0.375rem,1.35svh,1rem)] text-[clamp(0.66rem,1.55svh,0.875rem)] leading-[1.45] text-zinc-300">
                ClearKorea는 선거 투명성, 전면 조사, 재발 방지, 공정한
                재투표 요구를 공개 기록으로 남기는 시민 플랫폼이다. 우리는
                폭로가 아니라 검증을, 분노가 아니라 책임 있는 기록을 선택한다.
              </p>
              <p className="mt-[clamp(0.375rem,1.35svh,1rem)] text-[clamp(0.66rem,1.55svh,0.875rem)] leading-[1.45] text-zinc-300">
                Unrecorded suspicion disappears. An unverifiable election
                silences democracy. ClearKorea preserves lawful civic testimony,
                foreign press tracking, verified posts, and public demands for
                transparent investigation and recurrence prevention.
              </p>
            </aside>
          </div>
        </ShellFrame>
      </section>
    </main>
  );
}
