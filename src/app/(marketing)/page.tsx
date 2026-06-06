import Image from "next/image";

const principles = [
  "Full investigation",
  "Prevention of recurrence",
  "Election transparency",
  "Fair re-vote",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-between">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/pwa-icon.svg"
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
          <a
            href="https://github.com/KR20260603/clearkorea"
            className="text-sm text-zinc-300 transition hover:text-white"
          >
            GitHub
          </a>
        </header>

        <div className="grid gap-10 py-14 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/15 px-3 py-1 text-sm text-zinc-300">
              Open-source civic transparency platform
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] text-white md:text-7xl">
              Your voice, on the record.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              ClearKorea is an online square for lawful participation, rally
              support, livestream aggregation, verified posts, and foreign press
              tracking around Korean election transparency.
            </p>
            <a
              href="/app"
              className="mt-8 inline-flex min-h-12 items-center justify-center border border-white/20 bg-white px-6 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:border-civic-red hover:bg-civic-red hover:text-white"
            >
              Enter
            </a>
          </div>

          <div className="border border-white/12 bg-black/35 p-5">
            <div className="h-1 w-full bg-gradient-to-r from-civic-red via-white to-civic-blue" />
            <ul className="mt-6 grid gap-3">
              {principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-center justify-between border-b border-white/10 pb-3 text-sm"
                >
                  <span className="text-zinc-200">{principle}</span>
                  <span className="h-2 w-2 rounded-full bg-white" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
