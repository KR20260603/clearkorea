import { SEVERITY_META, type StationSeverity } from "@/lib/stations/stations";

// Ballot-box SVG ported from prototypes/affected-stations. A low fill level
// visualizes ballot shortage; severity drives both fill height and color.
const INNER_TOP = 33;
const INNER_BOTTOM = 75;

export function BallotBox({ severity }: { severity: StationSeverity }) {
  const meta = SEVERITY_META[severity];
  const innerHeight = INNER_BOTTOM - INNER_TOP;
  const fillHeight = innerHeight * meta.fill;
  const fillY = INNER_BOTTOM - fillHeight;

  return (
    <svg viewBox="0 0 80 92" className="mx-auto block h-auto w-[62%] max-w-[78px]" aria-hidden="true">
      <circle cx="60" cy="17" r="9" fill={meta.color} opacity="0.32" />
      <path
        d="M16 30 H64 V78 Q64 80 62 80 H18 Q16 80 16 78 Z"
        fill="#15161a"
        stroke="#3a3d46"
        strokeWidth="1.4"
      />
      <rect x="18" y={fillY} width="44" height={fillHeight} rx="1.5" fill={meta.color} opacity="0.85" />
      <line
        x1="18"
        y1={INNER_TOP + innerHeight * 0.5}
        x2="62"
        y2={INNER_TOP + innerHeight * 0.5}
        stroke="#2a2c33"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <path d="M11 23 H69 L66 31 H14 Z" fill="#202228" stroke="#3a3d46" strokeWidth="1.4" />
      <rect x="32" y="25.5" width="16" height="3.2" rx="1.6" fill="#000" />
      <g transform="rotate(-16 40 18)">
        <rect x="33" y="6" width="14" height="20" rx="1.5" fill="#f4f4f0" stroke="#c9c9c2" strokeWidth="0.7" />
        <line x1="36" y1="11" x2="44" y2="11" stroke={meta.color} strokeWidth="1.2" />
        <line x1="36" y1="14.5" x2="44" y2="14.5" stroke="#bdbdb6" strokeWidth="1" />
        <line x1="36" y1="17.5" x2="42" y2="17.5" stroke="#bdbdb6" strokeWidth="1" />
      </g>
      <circle cx="60" cy="17" r="4" fill={meta.color} />
    </svg>
  );
}
