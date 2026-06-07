import type { RallyListItem } from "@/lib/rallies/rallies";

// Lightweight decorative projection of rally coordinates into an SVG viewBox.
// Avoids a heavy map dependency; bounds cover the supported KR rally regions.
const LNG_MIN = 126.4;
const LNG_MAX = 129.3;
const LAT_MIN = 34.9;
const LAT_MAX = 37.9;
const VIEW_W = 100;
const VIEW_H = 80;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (VIEW_W - 16) + 8;
  const y = (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * (VIEW_H - 16) + 8;
  return { x, y };
}

export function RalliesMap({ rallies }: { rallies: readonly RallyListItem[] }) {
  const points = rallies
    .filter((rally) => rally.lat !== null && rally.lng !== null)
    .map((rally) => ({
      id: rally.id,
      title: rally.title,
      active: rally.status === "active",
      ...project(rally.lat as number, rally.lng as number),
    }));

  return (
    <section
      aria-label="Rally locations map"
      className="shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-black/30"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={`${points.length} rally locations`}
        className="h-[clamp(7rem,22svh,11rem)] w-full"
      >
        <defs>
          <pattern id="rally-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width={VIEW_W} height={VIEW_H} fill="url(#rally-grid)" />
        {points.map((point) => (
          <g key={point.id}>
            {point.active ? (
              <circle cx={point.x} cy={point.y} r="4.5" fill="rgba(205,46,58,0.25)">
                <animate
                  attributeName="r"
                  values="3;6;3"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            ) : null}
            <circle
              cx={point.x}
              cy={point.y}
              r="2"
              fill={point.active ? "#CD2E3A" : "#5b9bff"}
              stroke="#0A0A0A"
              strokeWidth="0.6"
            />
          </g>
        ))}
      </svg>
    </section>
  );
}
