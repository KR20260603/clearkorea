import React, { useMemo, useState } from "react";

/**
 * ClearKorea - Affected Polling Stations (투표용지 부족 투표소)
 *
 * 뉴스 기반 검증 리스트 보드. 데이터는 아래 STATIONS 배열에 시드 형태로 둔다.
 * 뉴스로 새 투표소가 확인될 때마다 항목을 추가한다. 일 1회 Cron 갱신 구조와 같은 데이터 형태를 유지한다.
 *
 * 포팅 메모: Next 앱으로 옮길 때 STATIONS 를 별도 데이터 파일 또는 DB 테이블로 분리하고,
 * UPDATED_AT 을 갱신 작업이 기록하게 한다.
 */

const UPDATED_AT = "2026-06-06";

// 선관위 5일 브리핑 기준 요약 (전국 14,288곳 중)
const SUMMARY = {
  confirmed: 50, // 실제 용지 부족
  halted: 22, // 잠시라도 투표 중단
  regions: "서울 33 · 인천 6 · 부산 3 · 대구 4 · 울산 2 · 경남 2",
};

// severity: red(중단) > orange(부족) > yellow(경미·추가송부)
const SEV = {
  red: { color: "#E63946", glow: "rgba(230,57,70,.85)", label: "투표 중단", fill: 0.12 },
  orange: { color: "#F08A24", glow: "rgba(240,138,36,.8)", label: "용지 부족", fill: 0.3 },
  yellow: { color: "#E9C13B", glow: "rgba(233,193,59,.75)", label: "경미·추가송부", fill: 0.52 },
};

const STATIONS = [
  { name: "가락2동 제3투표소", area: "서울 송파구", sev: "red" },
  { name: "가락2동 제7투표소", area: "서울 송파구", sev: "red" },
  { name: "개포 일대", area: "서울 강남구", sev: "orange" },
  { name: "경남 (2곳)", area: "경상남도", sev: "yellow" },
  { name: "구의 일대", area: "서울 광진구", sev: "orange" },
  { name: "노량진 일대", area: "서울 동작구", sev: "orange" },
  { name: "대구 (4곳)", area: "대구광역시", sev: "orange" },
  { name: "문정1동 제4투표소", area: "서울 송파구", sev: "orange" },
  { name: "문정2동 제2투표소", area: "서울 송파구", sev: "red" },
  { name: "부산 (3곳)", area: "부산광역시", sev: "orange" },
  { name: "연수구 일대", area: "인천 연수구", sev: "red" },
  { name: "울산 (2곳)", area: "울산광역시", sev: "yellow" },
  { name: "위례 일대", area: "서울 송파구", sev: "orange" },
  { name: "잠실2동 제6투표소", area: "서울 송파구", sev: "red" },
  { name: "잠실4동 제7투표소", area: "서울 송파구", sev: "red", note: "14:25 잔여 35매" },
  { name: "청담 일대", area: "서울 강남구", sev: "orange" },
];

function BallotBox({ sev }) {
  const s = SEV[sev];
  const innerTop = 33;
  const innerBottom = 75;
  const innerH = innerBottom - innerTop;
  const fillH = innerH * s.fill;
  const fillY = innerBottom - fillH;
  return (
    <svg viewBox="0 0 80 92" className="ballot" aria-hidden="true">
      {/* glow status light */}
      <circle cx="60" cy="17" r="9" fill={s.glow} opacity="0.45" className="ck-pulse" />
      {/* box body */}
      <path
        d="M16 30 H64 V78 Q64 80 62 80 H18 Q16 80 16 78 Z"
        fill="#15161a"
        stroke="#3a3d46"
        strokeWidth="1.4"
      />
      {/* fill (remaining ballots) - low = shortage */}
      <rect x="18" y={fillY} width="44" height={fillH} rx="1.5" fill={s.color} opacity="0.85" />
      {/* faint level ticks */}
      <line x1="18" y1={innerTop + innerH * 0.5} x2="62" y2={innerTop + innerH * 0.5} stroke="#2a2c33" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* lid */}
      <path d="M11 23 H69 L66 31 H14 Z" fill="#202228" stroke="#3a3d46" strokeWidth="1.4" />
      {/* slot */}
      <rect x="32" y="25.5" width="16" height="3.2" rx="1.6" fill="#000" />
      {/* ballot paper, half inserted */}
      <g transform="rotate(-16 40 18)">
        <rect x="33" y="6" width="14" height="20" rx="1.5" fill="#f4f4f0" stroke="#c9c9c2" strokeWidth="0.7" />
        <line x1="36" y1="11" x2="44" y2="11" stroke={s.color} strokeWidth="1.2" />
        <line x1="36" y1="14.5" x2="44" y2="14.5" stroke="#bdbdb6" strokeWidth="1" />
        <line x1="36" y1="17.5" x2="42" y2="17.5" stroke="#bdbdb6" strokeWidth="1" />
      </g>
      {/* status light core */}
      <circle cx="60" cy="17" r="4" fill={s.color} />
    </svg>
  );
}

export default function AffectedStations() {
  const [filter, setFilter] = useState("all");

  const sorted = useMemo(
    () => [...STATIONS].sort((a, b) => a.name.localeCompare(b.name, "ko")),
    []
  );
  const shown = useMemo(
    () => (filter === "all" ? sorted : sorted.filter((d) => d.sev === filter)),
    [sorted, filter]
  );

  return (
    <div className="ck-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gothic+A1:wght@400;500;700;900&display=swap');
        .ck-root{
          --bg:#0A0A0A; --fg:#ffffff; --muted:#9a9ba3; --red:#E63946; --blue:#0047A0;
          min-height:100%; background:
            radial-gradient(900px 500px at 80% -10%, rgba(0,71,160,.16), transparent 60%),
            radial-gradient(700px 400px at -10% 110%, rgba(230,57,70,.12), transparent 55%),
            var(--bg);
          color:var(--fg); font-family:'Gothic A1',sans-serif;
          padding:28px 16px 40px; box-sizing:border-box;
        }
        .ck-wrap{max-width:980px;margin:0 auto;}
        .ck-kicker{font-size:11px;letter-spacing:.32em;color:var(--muted);text-transform:uppercase;}
        .ck-title{font-family:'Black Han Sans',sans-serif;font-weight:400;line-height:1.05;
          font-size:clamp(30px,8vw,52px);margin:8px 0 4px;letter-spacing:-.01em;}
        .ck-title em{color:var(--red);font-style:normal;}
        .ck-sub{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;margin-top:6px;}
        .ck-live{width:8px;height:8px;border-radius:50%;background:#27c93f;box-shadow:0 0 0 0 rgba(39,201,63,.6);
          animation:ck-live 1.8s infinite;}
        @keyframes ck-live{0%{box-shadow:0 0 0 0 rgba(39,201,63,.55)}70%{box-shadow:0 0 0 7px rgba(39,201,63,0)}100%{box-shadow:0 0 0 0 rgba(39,201,63,0)}}
        .ck-stats{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 6px;}
        .ck-stat{flex:1;min-width:96px;border:1px solid #23252c;border-radius:14px;padding:12px 14px;
          background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,0));}
        .ck-stat b{font-family:'Black Han Sans',sans-serif;font-size:26px;display:block;line-height:1;}
        .ck-stat span{font-size:11px;color:var(--muted);}
        .ck-regions{font-size:12px;color:var(--muted);margin:4px 2px 0;}
        .ck-legend{display:flex;gap:14px;flex-wrap:wrap;margin:18px 0 16px;}
        .ck-leg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--muted);cursor:pointer;
          border:1px solid transparent;border-radius:999px;padding:4px 10px;transition:.15s;}
        .ck-leg:hover{border-color:#2c2e36;color:#d8d8dd;}
        .ck-leg.active{border-color:#33353d;background:rgba(255,255,255,.04);color:#fff;}
        .ck-dot{width:10px;height:10px;border-radius:50%;}
        .ck-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
        @media(min-width:560px){.ck-grid{grid-template-columns:repeat(4,1fr);}}
        @media(min-width:820px){.ck-grid{grid-template-columns:repeat(6,1fr);}}
        .ck-card{border:1px solid #1e2027;border-radius:16px;padding:12px 8px 11px;text-align:center;
          background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,0));
          opacity:0;transform:translateY(8px);animation:ck-in .5s forwards;}
        @keyframes ck-in{to{opacity:1;transform:none;}}
        .ballot{width:62%;max-width:78px;height:auto;display:block;margin:0 auto 6px;}
        .ck-pulse{animation:ck-glow 2.2s ease-in-out infinite;transform-origin:60px 17px;}
        @keyframes ck-glow{0%,100%{opacity:.28}50%{opacity:.6}}
        .ck-name{font-size:12px;font-weight:700;line-height:1.25;word-break:keep-all;}
        .ck-area{font-size:10.5px;color:var(--muted);margin-top:2px;}
        .ck-tag{display:inline-block;font-size:9.5px;margin-top:6px;padding:2px 7px;border-radius:999px;
          font-weight:700;}
        .ck-note{font-size:9px;color:#73757d;margin-top:3px;}
        .ck-foot{margin-top:22px;font-size:11.5px;color:#6e7079;line-height:1.6;}
      `}</style>

      <div className="ck-wrap">
        <div className="ck-kicker">ClearKorea</div>
        <h1 className="ck-title">투표용지 <em>부족</em> 투표소</h1>
        <div className="ck-kicker" style={{ letterSpacing: ".2em" }}>AFFECTED POLLING STATIONS</div>
        <div className="ck-sub"><span className="ck-live" /> 업데이트 {UPDATED_AT} · 확인되는 대로 계속 추가</div>

        <div className="ck-stats">
          <div className="ck-stat"><b>{SUMMARY.confirmed}</b><span>확인된 부족 투표소</span></div>
          <div className="ck-stat"><b style={{ color: SEV.red.color }}>{SUMMARY.halted}</b><span>잠시라도 투표 중단</span></div>
          <div className="ck-stat"><b>6</b><span>영향 시·도</span></div>
        </div>
        <div className="ck-regions">{SUMMARY.regions}</div>

        <div className="ck-legend">
          {[["all", "전체", "#777"], ["red", SEV.red.label, SEV.red.color], ["orange", SEV.orange.label, SEV.orange.color], ["yellow", SEV.yellow.label, SEV.yellow.color]].map(
            ([key, label, color]) => (
              <div
                key={key}
                className={"ck-leg" + (filter === key ? " active" : "")}
                onClick={() => setFilter(key)}
              >
                <span className="ck-dot" style={{ background: color }} />
                {label}
              </div>
            )
          )}
        </div>

        <div className="ck-grid">
          {shown.map((d, i) => {
            const s = SEV[d.sev];
            return (
              <div className="ck-card" key={d.name} style={{ animationDelay: `${i * 45}ms` }}>
                <BallotBox sev={d.sev} />
                <div className="ck-name">{d.name}</div>
                <div className="ck-area">{d.area}</div>
                <span
                  className="ck-tag"
                  style={{ color: s.color, background: `${s.color}1f`, border: `1px solid ${s.color}55` }}
                >
                  {s.label}
                </span>
                {d.note && <div className="ck-note">{d.note}</div>}
              </div>
            );
          })}
        </div>

        <div className="ck-foot">
          출처: 중앙선관위 6월 5일 브리핑 및 보도 기준. 일부는 구·시 단위 집계(N곳)로 표시되며,
          개별 투표소명은 확인되는 대로 갱신됩니다. 이 목록은 행정 부실로 확인된 투표소를 정리한 것으로,
          그 자체가 부정선거를 단정하지 않습니다.
        </div>
      </div>
    </div>
  );
}
