import { createRandom, hashSeed } from '@/lib/random';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Creates a short, human-readable seed without external entropy services. */
export function createSeed(): string {
  const bytes = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    const random = createRandom(Date.now());
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(random() * 256);
  }
  const code = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
  return `ECL-${code.slice(0, 3)}-${code.slice(3)}`;
}

export function normalizeSeed(value: string): string {
  return value.trim().slice(0, 40) || 'eclipse';
}

export function seedToNumber(value: string): number {
  return hashSeed(normalizeSeed(value));
}
