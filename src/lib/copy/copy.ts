export const dockLabels = ["Home", "Rallies", "Square", "Live", "News"] as const;

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
