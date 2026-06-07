export const dockLabels = ["Today", "Rallies", "Square", "Live", "News"] as const;

export const counterLabels = {
  participants: "People who spoke up",
  voices: "Voices",
} as const;

type BilingualCopy = {
  readonly en: string;
  readonly ko: string;
};

export const bilingualCopy = {
  reportPost: {
    en: "Report a public figure's post. Paste the original SNS link.",
    ko: "공인이나 준공인의 게시물을 제보하세요. 원본 SNS 링크를 붙여넣으면 됩니다.",
  },
  squareEmpty: {
    en: "No public voices are visible yet. Verified participants can speak up when the square opens.",
    ko: "아직 공개된 목소리가 없습니다. 광장이 열리면 인증된 참여자가 목소리를 남길 수 있습니다.",
  },
  adminApply: {
    en: "Apply to help verify reports, rally updates, and public records.",
    ko: "제보, 집회 업데이트, 공개 기록 검증을 돕기 위해 관리자 신청을 할 수 있습니다.",
  },
} as const satisfies Record<string, BilingualCopy>;

export const safetyGuardrails = [
  "no doxxing",
  "no unlawful organizing",
  "no private retaliation",
] as const;

export const seoulCongestionDisclaimer = {
  en: "Seoul data is regional real-time congestion for nearby public areas.",
  ko: "서울 데이터는 집회 인원 수가 아니라 지역 실시간 혼잡도입니다.",
} as const satisfies BilingualCopy;

export const affectedStationsDisclaimer = {
  en: "This list summarizes confirmed administrative failures and does not prove election fraud.",
  ko: "이 목록은 확인된 행정상 문제를 요약하며, 그 자체로 선거 부정을 증명하지 않습니다.",
} as const satisfies BilingualCopy;

export const ralliesIntro = {
  en: "Find lawful gatherings and ways to support people who cannot attend in person.",
  ko: "합법적인 집회와, 현장에 못 나오는 사람들을 지원하는 방법을 확인하세요.",
} as const satisfies BilingualCopy;

export const rallySupportGuide = [
  {
    en: "Send a food or drink delivery to a confirmed on-site organizer, never to a private individual.",
    ko: "확인된 현장 주최 측에 음식이나 음료 배달을 보내세요. 특정 개인에게는 보내지 마세요.",
  },
  {
    en: "Share rally times and lawful guidance so remote supporters can plan safely.",
    ko: "집회 시간과 합법적인 안내를 공유해 원격 지원자가 안전하게 계획할 수 있게 하세요.",
  },
  {
    en: "Keep it lawful: no blocking vote counting, no private retaliation, no doxxing.",
    ko: "합법을 지키세요: 개표 방해, 사적 제재, 신상 유출은 금지입니다.",
  },
] as const satisfies readonly BilingualCopy[];

export const rallyCongestionPending = {
  en: "Regional congestion connects at launch through the Seoul real-time city data feed.",
  ko: "지역 혼잡도는 서울 실시간 도시데이터 연동 후 공개 시점에 연결됩니다.",
} as const satisfies BilingualCopy;
