import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { generateSite } from "@pandino/ai";
import { htmlDocument } from "./document";

describe("html export", () => {
  it("writes one Futura page and keeps placeholders labeled", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite({ prompt: "Futura Auto Body Shop, Milano, Italy", brandColor: "#E11D48" });
    const css = readFileSync(new URL("../../../apps/web/app/site.css", import.meta.url), "utf8");
    const html = htmlDocument(site, css);
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain("Futura Auto Body Shop");
    expect(html).toContain("Collision repair in Milano, done with care");
    expect(html).toContain("Placeholder");
    expect(html).toContain(".hero-grid");
    expect(html).not.toContain("I-CAR");
  });
});
