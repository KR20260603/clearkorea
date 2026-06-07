import {
  nicknameWordBuckets,
  syllableSumCombinations,
  type SyllableLength,
} from "./nickname-contract";

function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createDeterministicSequence(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFromBucket(
  length: SyllableLength,
  next: () => number,
): string {
  const bucket = nicknameWordBuckets[length];
  return bucket[Math.floor(next() * bucket.length)];
}

export function generateNickname(stableKey: string): string {
  const next = createDeterministicSequence(fnv1aHash(stableKey));

  const [firstLength, secondLength] =
    syllableSumCombinations[
      Math.floor(next() * syllableSumCombinations.length)
    ];

  const firstWord = pickFromBucket(firstLength, next);
  const secondWord = pickFromBucket(secondLength, next);
  const digits = String(Math.floor(next() * 10000)).padStart(4, "0");

  return `${firstWord}${secondWord}${digits}`;
}
