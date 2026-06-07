import type { StreamItem } from "@/lib/streams/streams";

export function StreamGrid({
  title,
  streams,
  emptyLabel,
  live = false,
}: {
  title: string;
  streams: readonly StreamItem[];
  emptyLabel: string;
  live?: boolean;
}) {
  return (
    <section aria-label={title} className="shrink-0">
      <h2 className="flex items-center gap-2 text-[clamp(0.78rem,1.8svh,0.95rem)] font-bold uppercase tracking-[0.14em] text-zinc-300">
        {live ? (
          <span className="inline-flex h-2 w-2 rounded-full bg-civic-red" aria-hidden="true" />
        ) : null}
        {title}
      </h2>
      {streams.length === 0 ? (
        <p className="mt-2 rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-[clamp(0.7rem,1.6svh,0.875rem)] text-zinc-400">
          {emptyLabel}
        </p>
      ) : (
        <ul className="mt-2 grid gap-[clamp(0.625rem,1.8svh,1rem)] sm:grid-cols-2">
          {streams.map((stream) => (
            <li
              key={stream.id}
              className="overflow-hidden rounded-2xl border border-white/12 bg-black/30"
            >
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${stream.youtubeId}`}
                  title={stream.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <p className="p-3 text-[clamp(0.72rem,1.65svh,0.9rem)] font-semibold text-white">
                {stream.title}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
