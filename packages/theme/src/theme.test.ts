import { describe, expect, it } from "vitest";
import { contrast, themeFromBrand } from "./theme";

const SAMPLES = ["#E11D48", "#FFFFFF", "#000000", "#FFFF00", "#777777", "#0F6E56", "#1D4ED8", "#7C3AED"];

describe("themeFromBrand", () => {
  it("keeps button and body text readable for awkward brand colors", () => {
    for (const brand of SAMPLES) {
      const theme = themeFromBrand(brand);
      expect(contrast(theme.palette.primary, theme.palette.onPrimary)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme.palette.text, theme.palette.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme.palette.primary, theme.palette.surface)).toBeGreaterThanOrEqual(1.4);
      expect(theme.palette.primary).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("pairs a rose brand with the bold mockup fonts", () => {
    const theme = themeFromBrand("#E11D48");
    expect(theme.vibe).toBe("bold-trustworthy");
    expect(theme.fonts).toEqual({ heading: "Syne", body: "Manrope" });
    expect(theme.radius).toBe("md");
    expect(theme.spacing).toBe("comfortable");
  });
});
