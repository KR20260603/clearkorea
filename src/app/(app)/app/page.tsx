const dockLabels = ["Home", "Rallies", "Square", "Live", "News"];

export default function AppHomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
            ClearKorea
          </p>
          <h1 className="mt-2 text-3xl font-black">Home</h1>
        </div>
        <span className="text-sm text-zinc-300">Guest</span>
      </header>
      <section className="grid flex-1 place-items-center py-16 text-center">
        <div>
          <p className="text-lg text-zinc-300">
            The five-tab civic app shell is ready for v1 implementation.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {dockLabels.map((label) => (
              <span
                key={label}
                className="border border-white/10 px-3 py-2 text-sm text-white"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
