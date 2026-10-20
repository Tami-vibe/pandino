import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { generateSite } from "@pandino/ai";
import { SitePage } from "./page";

describe("SitePage", () => {
  it("renders the Futura preview in English with Italian contact details", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite({
      prompt: "Futura Auto Body Shop, Milano, Italy",
      brandColor: "#E11D48",
      market: "auto",
    });
    const html = site.pages.map((page) => renderToStaticMarkup(<SitePage site={site} slug={page.slug} links="file" />)).join("\n");
    expect(html).toContain("Futura Auto Body Shop");
    expect(html).toContain("Collision repair in Milano, done with care");
    expect(html).not.toContain("WhatsApp");
    expect(html).toContain("Get an estimate");
    expect(html).toContain(">Call<");
    expect(html).toContain("da € …");
    expect(html).toContain("Dent / PDR");
    expect(html).toContain("ADAS calibration");
    expect(html).toContain(">Sample<");
    expect(html).toContain("Sample photo of a person with a car. Not this shop.");
    expect(html).toContain("Via Esempio 12, 20100 Milano MI (sample)");
    expect(html).toContain("+39 02 0000 0000 (sample)");
    expect(html).toContain("info@futura-example.it (sample)");
    expect(html).toContain("href=\"services.html\"");
    expect(html).toContain("Informativa privacy");
    expect(html).toContain("Note legali");
    expect(html).toContain("P.IVA IT00000000000 (sample)");
    expect(html).toContain("Reject");
    expect(html).toContain("Accept");
    expect(html).not.toContain("ODR");
    expect(html).toContain("data-sticky=\"true\"");
    expect(html).toContain("Photos and a written estimate before any work. No surprise charges.");
    expect(html).toContain("Add your warranty or guarantee");
    expect(html).toContain("Sample · 5 · 3 reviews");
    expect(html).toContain("Learn more");
    expect(html).toContain("See all services");
    expect(html).toContain("From damage to done, without the stress.");
    expect(html).toContain("Had an accident? We&#x27;ll take it from here.");
    expect(html).not.toContain("Google reviews");
    expect(html).toContain("Get directions");
    expect(html).toContain("data-slot=\"mapbox\"");
    expect(html).toContain("Dent / body only");
    expect(html).toContain("Photos are usually enough for a body-only estimate.");
    expect(html).toContain("damage inside the car often doesn&#x27;t show in photos.");
    expect(html).toContain("Sample photo of a repair shop interior. Not this shop.");
    expect(html).not.toContain("I-CAR");
    expect(html).not.toMatch(/4\.9|320 Google/);
    expect(html).not.toContain("placeholder.pandino.invalid");
  });
});
