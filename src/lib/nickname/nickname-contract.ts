export const nicknamePattern = /^[가-힣]{6}\d{4}$/;

export type SyllableLength = 1 | 2 | 3 | 4 | 5;

export const nicknameWordBuckets: Record<SyllableLength, readonly string[]> = {
  1: ["빛", "길", "숲", "별", "달", "강", "들", "산", "비", "눈", "꽃", "샘"],
  2: [
    "바다", "하늘", "기록", "새벽", "노을", "구름", "단비", "이슬", "물결",
    "보름", "햇살", "바람", "아침", "가을", "봄날", "별빛", "달빛", "강물",
    "숲길", "꽃길", "마루", "나루", "들녘", "솔숲",
  ],
  3: [
    "무지개", "민들레", "미리내", "봄바람", "새벽길", "도라지", "진달래",
    "개나리", "함박꽃", "옹달샘", "시냇물", "푸른솔", "산들길", "가을빛",
    "등불길", "머루알",
  ],
  4: [
    "해바라기", "맑은하늘", "푸른물결", "새벽이슬", "가을하늘", "들꽃향기",
    "별빛바다", "단풍나무", "보름달빛", "솔바람결", "봄날아침", "은하수길",
  ],
  5: [
    "새벽기록자", "투명한광장", "푸른들판길", "맑은샘물가", "한들바람결",
    "별빛나그네", "가을하늘빛", "봄날들꽃밭",
  ],
};

export const syllableSumCombinations: ReadonlyArray<
  readonly [SyllableLength, SyllableLength]
> = [
  [1, 5],
  [2, 4],
  [3, 3],
  [4, 2],
  [5, 1],
];

export function validateGeneratedNickname(nickname: string): boolean {
  return nicknamePattern.test(nickname);
}
