import Image from "next/image";

const principles = [
  "Full investigation",
  "Prevention of recurrence",
  "Election transparency",
  "Fair re-vote",
] as const;

const proofPoints = [
  "AGPL-3.0-only",
  "Public repo",
  "Contributions open",
] as const;

export default function LandingPage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClearKorea",
    url: "https://clearkorea.com",
    sameAs: ["https://github.com/KR20260603/clearkorea"],
  };

  return (
    <main className="min-h-screen bg-civic-bg text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <section className="relative min-h-[92vh] overflow-hidden px-6 py-7">
        <div
          aria-hidden="true"
          data-testid="landing-hero-media"
          className="absolute inset-0 -z-10 bg-[image:url('/hero-mobile.png')] bg-cover bg-center md:bg-[image:url('/hero.png')]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.66)_46%,rgba(10,10,10,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-civic-bg to-transparent" />

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/pwa-icon.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="h-10 w-10"
            />
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
              ClearKorea
            </span>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(92vh-6rem)] w-full max-w-6xl items-center py-14">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex border border-white/15 bg-black/25 px-3 py-1 text-sm text-zinc-200">
              Open-source civic transparency platform
            </p>
            <h1 className="text-5xl font-black leading-[0.95] text-white md:text-7xl">
              Your voice, on the record.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              ClearKorea is an online square for lawful participation, rally
              support, livestream aggregation, verified posts, and foreign press
              tracking around Korean election transparency.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/app"
                className="inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:border-civic-red hover:bg-civic-red hover:text-white"
              >
                Enter
              </a>
              <a
                href="https://github.com/KR20260603/clearkorea"
                className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-civic-blue hover:bg-civic-blue"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">
              Civic guardrails
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Built for lawful participation and transparency.
            </h2>
          </div>
          <div className="grid gap-6">
            <ul className="grid gap-3 sm:grid-cols-2">
              {principles.map((principle) => (
                <li
                  key={principle}
                  className="border-l border-white/20 pl-4 text-sm text-zinc-200"
                >
                  {principle}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
