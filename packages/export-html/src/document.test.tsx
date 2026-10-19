import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { generateSite } from "@pandino/ai";
import { htmlPages } from "./document";

describe("html export", () => {
  it("writes one Futura page and keeps placeholders labeled", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite({ prompt: "Futura Auto Body Shop, Milano, Italy", brandColor: "#E11D48" });
    const css = readFileSync(new URL("../../../apps/web/app/site.css", import.meta.url), "utf8");
    const pages = htmlPages(site, css);
    const html = pages.map(([, text]) => text).join("\n");
    expect(pages.some(([name]) => name === "index.html")).toBe(true);
    expect(pages.some(([name]) => name === "privacy.html")).toBe(true);
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain("Futura Auto Body Shop");
    expect(html).toContain("Collision repair in Milano, done with care");
    expect(html).toContain(">Sample<");
    expect(html).toContain(".hero-screen");
    expect(html).toContain("Material+Symbols+Outlined");
    expect(html).not.toContain("I-CAR");
  });
});
