export const nicknamePattern = /^[가-힣]{6}\d{4}$/;

export const sampleNicknameWordBuckets = {
  1: ["빛", "길", "숲"],
  2: ["바다", "하늘", "기록"],
  3: ["무지개", "민들레", "등불길"],
  4: ["해바라기", "맑은하늘", "푸른물결"],
  5: ["새벽기록자", "투명한광장"],
} as const satisfies Record<number, readonly string[]>;

export function validateGeneratedNickname(nickname: string): boolean {
  return nicknamePattern.test(nickname);
}
