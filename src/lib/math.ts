/** Small, dependency-free math helpers used by simulation modules. */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Maps a value from one range to another, optionally clamping the result. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clampResult = true,
): number {
  if (inMax === inMin) return outMin;
  const result = outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  return clampResult ? clamp(result, Math.min(outMin, outMax), Math.max(outMin, outMax)) : result;
}

export function roundTo(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Wraps an angle to the [-PI, PI] interval. */
export function wrapAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  const wrapped = ((angle + Math.PI) % twoPi + twoPi) % twoPi;
  return wrapped - Math.PI;
}

export function magnitude([x, y, z]: readonly [number, number, number]): number {
  return Math.sqrt(x * x + y * y + z * z);
}
