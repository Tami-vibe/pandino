import presets from "../presets.json" with { type: "json" };

const SURFACE = "#FAFAF9";
const TEXT = "#1C1917";

type Hsl = { h: number; s: number; l: number };

function hexToRgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const channel = (value: number) => Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

function hexToHsl(hex: string): Hsl {
  const { r, g, b } = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { h: 0, s: 0, l: lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue = max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return { h: (hue * 60 + 360) % 360, s: saturation, l: lightness };
}

function hslToHex({ h, s, l }: Hsl) {
  const chroma = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - chroma * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return rgbToHex(channel(0) * 255, channel(8) * 255, channel(4) * 255);
}

function channelLinear(value: number) {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function contrast(a: string, b: string) {
  const luminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    return 0.2126 * channelLinear(r) + 0.7152 * channelLinear(g) + 0.0722 * channelLinear(b);
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

function ink(background: string) {
  return contrast(background, "#FFFFFF") >= contrast(background, "#111111") ? "#FFFFFF" : "#111111";
}

function readablePrimary(brand: string) {
  let hsl = hexToHsl(brand);
  if (contrast(brand, SURFACE) < 1.6) hsl = { ...hsl, l: Math.min(hsl.l, 0.36) };
  let color = hslToHex(hsl);
  for (let step = 0; step < 8 && contrast(color, "#FFFFFF") < 4.5 && contrast(color, "#111111") < 4.5; step += 1) {
    hsl = { ...hsl, l: Math.max(0.18, hsl.l - 0.05) };
    color = hslToHex(hsl);
  }
  return { primary: color, onPrimary: ink(color) };
}

function presetFor(hue: number) {
  const index = hue < 40 || hue >= 330 ? 2 : hue < 75 ? 4 : hue < 165 ? 0 : hue < 265 ? 1 : 3;
  return presets[index] ?? presets[2]!;
}

export function themeFromBrand(brandColor: string) {
  const preset = presetFor(hexToHsl(brandColor).h);
  return {
    brandColor: brandColor.toUpperCase(),
    vibe: preset.vibe,
    palette: { ...readablePrimary(brandColor), surface: SURFACE, text: TEXT },
    fonts: { heading: "Barlow Condensed", body: "Inter" },
    radius: preset.radius,
    spacing: "comfortable" as const,
    stickyHeader: true,
    typeScale: 1,
  };
}
