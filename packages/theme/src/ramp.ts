const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const L_T = [0.976, 0.947, 0.899, 0.832, 0.742, 0.67, 0.587, 0.511, 0.433, 0.377, 0.257];
const C_T = [0.015, 0.036, 0.069, 0.11, 0.151, 0.175, 0.177, 0.163, 0.136, 0.112, 0.077];

function hexToRgb(hex: string) {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) return null;
  const n = Number.parseInt(match[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToOklch(r: number, g: number, b: number) {
  const lin = (v: number) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), H: (Math.atan2(bb, a) * 180) / Math.PI };
}

function oklchToHex(L: number, C: number, H: number) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const toS = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  const ch = (v: number) => Math.round(Math.min(1, Math.max(0, toS(v))) * 255).toString(16).padStart(2, "0");
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return `#${ch(R)}${ch(G)}${ch(B)}`;
}

export function rampFromHex(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const { L, C, H } = rgbToOklch(rgb.r, rgb.g, rgb.b);
  let lock = 0;
  STEPS.forEach((_, index) => { if (Math.abs(L - (L_T[index] ?? 0)) < Math.abs(L - (L_T[lock] ?? 0))) lock = index; });
  return Object.fromEntries(STEPS.map((step, index) => {
    if (index === lock) return [step, hex.trim().toLowerCase().replace(/^#?/, "#")];
    const chroma = C < 0.045 ? Math.min(0.04, (C_T[index] ?? 0) * (C / 0.028)) : Math.min(0.37, C * ((C_T[index] ?? 0) / Math.max(0.02, C_T[lock] ?? 0.02)));
    return [step, oklchToHex(L_T[index] ?? L, chroma, H < 0 ? H + 360 : H)];
  }));
}

export function rampVars(hex: string) {
  const ramp = rampFromHex(hex);
  if (!ramp) return {};
  const primary = String(ramp[500] ?? hex);
  const rgb = hexToRgb(primary);
  const y = rgb ? (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255 : 0;
  const vars: Record<string, string> = { "--color-primary": primary, "--primary-color": primary, "--p": primary, "--pill-accent": primary, "--tone-mid": String(ramp[700] ?? primary), "--color-primary-content": y > 0.62 ? "#17191c" : "#ffffff" };
  for (const [step, color] of Object.entries(ramp)) {
    vars[`--active-${step}`] = String(color);
    vars[`--primary-${step}`] = String(color);
  }
  return vars;
}
