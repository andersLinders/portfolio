export type GlowPalette = {
  a: readonly [number, number, number];
  b: readonly [number, number, number];
};

/** Soft dual-glow atmospheres cycled while scrolling (no pink). */
export const ATMOSPHERE_PALETTES: readonly GlowPalette[] = [
  { a: [80, 100, 255], b: [0, 160, 255] }, // indigo / sky
  { a: [40, 200, 120], b: [0, 170, 190] }, // green / teal
  { a: [100, 70, 255], b: [0, 200, 255] }, // violet / cyan
  { a: [230, 190, 40], b: [90, 90, 255] }, // yellow / periwinkle
  { a: [60, 190, 80], b: [40, 140, 255] }, // leaf / blue
  { a: [255, 200, 50], b: [40, 200, 160] }, // gold / mint
  { a: [30, 160, 220], b: [70, 90, 255] }, // azure / indigo
  { a: [180, 210, 40], b: [50, 180, 120] }, // lime / green
];

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function mixChannel(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  t: number,
): string {
  return [
    Math.round(lerp(from[0], to[0], t)),
    Math.round(lerp(from[1], to[1], t)),
    Math.round(lerp(from[2], to[2], t)),
  ].join(", ");
}

/** Map 0–1 scroll progress onto interpolated glow RGB channel strings. */
export function atmosphereGlowsAt(progress: number): {
  a: string;
  b: string;
} {
  const palettes = ATMOSPHERE_PALETTES;
  const count = palettes.length;
  if (count === 0) {
    return { a: "80, 100, 255", b: "0, 160, 255" };
  }
  if (count === 1) {
    return {
      a: palettes[0].a.join(", "),
      b: palettes[0].b.join(", "),
    };
  }

  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * (count - 1);
  const index = Math.min(count - 2, Math.floor(scaled));
  const t = scaled - index;
  const from = palettes[index];
  const to = palettes[index + 1];

  return {
    a: mixChannel(from.a, to.a, t),
    b: mixChannel(from.b, to.b, t),
  };
}
