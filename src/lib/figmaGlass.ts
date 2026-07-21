/**
 * Figma Glass map generation + SVG filter helpers.
 *
 * Algorithm adapted from the published Figma Glass → SVG pipeline
 * (SDF edge refraction, specular rim, optional RGB dispersion):
 * https://yvainee.com/blog/implementing-figmas-glass-effect-with-svg-filters
 *
 * Figma node 140:682 GLASS effect (Plugin API):
 *   radius (frost): 4
 *   refraction: 0.8
 *   depth: 20
 *   lightAngle: -45
 *   lightIntensity: 0.8
 *   dispersion: 0.5
 *   splay: 0  (not modeled — no public web equivalent)
 */

export type FigmaGlassEffect = {
  frost: number;
  /** Figma 0–1 scale */
  refraction: number;
  depth: number;
  /** Degrees, Figma convention */
  lightAngle: number;
  /** Figma 0–1 scale */
  lightIntensity: number;
  /** Figma 0–1 scale */
  dispersion: number;
};

/** Exact Glass effect from Figma node 140:682 */
export const CONTACT_MODAL_GLASS: FigmaGlassEffect = {
  frost: 4,
  refraction: 0.8,
  depth: 20,
  lightAngle: -45,
  lightIntensity: 0.8,
  dispersion: 0.5,
};

const SURFACE_FN = (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 0.25);
const SCALE_RATIO = 1;
const SPEC_SAT = 4;

function refractionToParams(refraction01: number) {
  const t = Math.min(1, Math.max(0, refraction01));
  return {
    ior: 1 + t * 4,
    glassThickness: 10 + t * 190,
  };
}

function calculateRefractionProfile(
  glassThickness: number,
  depth: number,
  ior: number,
  samples = 128,
): Float64Array {
  const eta = 1 / ior;

  function refract(nx: number, ny: number): [number, number] | null {
    const dot = ny;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const sq = Math.sqrt(k);
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
  }

  const profile = new Float64Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = SURFACE_FN(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = SURFACE_FN(x + dx);
    const deriv = (y2 - y) / dx;
    const mag = Math.sqrt(deriv * deriv + 1);
    const ref = refract(-deriv / mag, -1 / mag);
    if (!ref) {
      profile[i] = 0;
      continue;
    }
    profile[i] = ref[0] * ((y * depth + glassThickness) / ref[1]);
  }
  return profile;
}

/** Rounded-rect SDF: distance (negative inside) + outward normal */
function roundedRectSDF(
  px: number,
  py: number,
  w: number,
  h: number,
  r: number,
): { dist: number; nx: number; ny: number } {
  const x = px - w / 2;
  const y = py - h / 2;
  const bx = w / 2 - r;
  const by = h / 2 - r;
  const dx = Math.abs(x) - bx;
  const dy = Math.abs(y) - by;

  if (dx <= 0 && dy <= 0) {
    if (-dx < -dy) {
      return { dist: dx - r, nx: x > 0 ? 1 : -1, ny: 0 };
    }
    return { dist: dy - r, nx: 0, ny: y > 0 ? 1 : -1 };
  }
  if (dx > 0 && dy > 0) {
    const cd = Math.sqrt(dx * dx + dy * dy);
    const inv = cd > 0 ? 1 / cd : 0;
    return {
      dist: cd - r,
      nx: dx * inv * Math.sign(x),
      ny: dy * inv * Math.sign(y),
    };
  }
  if (dx > dy) {
    return { dist: dx - r, nx: x > 0 ? 1 : -1, ny: 0 };
  }
  return { dist: dy - r, nx: 0, ny: y > 0 ? 1 : -1 };
}

function generateDisplacementMap(
  w: number,
  h: number,
  radius: number,
  depth: number,
  profile: Float64Array,
  maxDisp: number,
): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128;
    d[i + 1] = 128;
    d[i + 2] = 0;
    d[i + 3] = 255;
  }

  const S = profile.length;
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const { dist, nx, ny } = roundedRectSDF(x1, y1, w, h, radius);
      if (dist > 1) continue;

      const fromEdge = -dist;
      if (fromEdge >= depth) continue;

      const op = dist > 0 ? 1 - dist : 1;
      if (fromEdge <= 0 && op <= 0) continue;

      const bi = Math.min(((Math.max(0, fromEdge) / depth) * S) | 0, S - 1);
      const disp = profile[bi] || 0;
      const dX = (-nx * disp) / maxDisp;
      const dY = (-ny * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dX * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
    }
  }

  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function generateSpecularMap(
  w: number,
  h: number,
  radius: number,
  depth: number,
  angleRad: number,
): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(w, h);
  const d = img.data;
  d.fill(0);
  const sv = [Math.cos(angleRad), Math.sin(angleRad)];

  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const { dist, nx, ny } = roundedRectSDF(x1, y1, w, h, radius);
      if (dist > 1) continue;

      const fromEdge = -dist;
      if (fromEdge >= depth) continue;

      const op = dist > 0 ? 1 - dist : 1;
      if (op <= 0) continue;

      const dot = Math.abs(nx * sv[0] + -ny * sv[1]);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - Math.max(0, fromEdge)) ** 2));
      const alpha = (255 * Math.pow(dot * edge, 1.5) * op) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = 255;
      d[idx + 1] = 255;
      d[idx + 2] = 255;
      d[idx + 3] = alpha;
    }
  }

  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

export type GlassFilterMaps = {
  dispUrl: string;
  specUrl: string;
  scale: number;
  frost: number;
  lightIntensity: number;
  /** Dispersion on 0–100 scale for the SVG filter branch */
  dispersionPct: number;
};

export function buildGlassFilterMaps(
  width: number,
  height: number,
  borderRadius: number,
  effect: FigmaGlassEffect,
): GlassFilterMaps | null {
  if (typeof document === "undefined") return null;
  if (width < 2 || height < 2) return null;

  const { ior, glassThickness } = refractionToParams(effect.refraction);
  const clampedDepth = Math.min(
    effect.depth,
    Math.min(width, height) / 2 - 1,
  );
  const profile = calculateRefractionProfile(
    glassThickness,
    clampedDepth,
    ior,
  );
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const angleRad = (effect.lightAngle * Math.PI) / 180;

  return {
    dispUrl: generateDisplacementMap(
      width,
      height,
      borderRadius,
      clampedDepth,
      profile,
      maxDisp,
    ),
    specUrl: generateSpecularMap(
      width,
      height,
      borderRadius,
      clampedDepth * 2.5,
      angleRad,
    ),
    scale: maxDisp * SCALE_RATIO,
    frost: effect.frost,
    lightIntensity: effect.lightIntensity,
    dispersionPct: effect.dispersion * 100,
  };
}

export { SPEC_SAT };
