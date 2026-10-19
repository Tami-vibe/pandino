import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it, vi } from "vitest";
import { generateSite } from "@pandino/ai";
import { wordpressTheme } from "./theme";

describe("wordpress export", () => {
  it("zips a GPL block theme for Futura without a form", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite({ prompt: "Futura Auto Body Shop, Milano, Italy", brandColor: "#E11D48" });
    const dir = mkdtempSync(join(tmpdir(), "pandino-theme-"));
    const zipPath = join(dir, "theme.zip");
    writeFileSync(zipPath, wordpressTheme(site));
    const tested = spawnSync("python3", ["-m", "zipfile", "-t", zipPath], { encoding: "utf8" });
    expect(tested.status).toBe(0);
    const extracted = spawnSync("python3", ["-m", "zipfile", "-e", zipPath, dir], { encoding: "utf8" });
    expect(extracted.status).toBe(0);
    const style = readFileSync(join(dir, "pandino-site/style.css"), "utf8");
    const theme = readFileSync(join(dir, "pandino-site/theme.json"), "utf8");
    const template = readFileSync(join(dir, "pandino-site/templates/index.html"), "utf8");
    const gallery = readFileSync(join(dir, "pandino-site/templates/page-gallery.html"), "utf8");
    const estimate = readFileSync(join(dir, "pandino-site/templates/page-estimate.html"), "utf8");
    expect(style).toContain("Theme Name: Futura Auto Body Shop");
    expect(style).toContain("GNU General Public License v2 or later");
    expect(theme).toContain(site.theme.palette.primary);
    expect(template).toContain("wp:html");
    expect(gallery).toContain(">Sample<");
    expect(gallery).toContain("Sample review. Not a real customer.");
    expect(template).not.toContain("<form");
    expect(estimate).not.toContain("<form");
    expect(estimate).toContain("This theme has no form.");
    expect(template).not.toContain("I-CAR");
  });
});
