import { afterEach, describe, expect, it, vi } from "vitest";
import { generateSite } from "./generate";
import { chatEndpoint } from "./model";
import { safeCopy } from "./build";

const futura = { prompt: "Futura Auto Body Shop, Milano, Italy", brandColor: "#E11D48", market: "auto" as const };
const rossi = { prompt: "Rossi Auto Body, collision repair and refinishing in Chicago", brandColor: "#E11D48", market: "auto" as const };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("generateSite", () => {
  it("builds Futura Milano as an Italian body shop with placeholders", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite(futura);
    expect(site.business).toMatchObject({
      name: "Futura Auto Body Shop", vertical: "body_shop", market: "IT", phone: "+390200000000",
      email: "info@futura-example.it", hours: "Mon–Fri 8:00–18:00 (sample)",
    });
    expect(site.business.address).toEqual({ street: "Via Esempio 12", city: "Milano", region: "MI", country: "IT" });
    expect(site.business.warranty).toBe("");
    expect(site.business.googleRating).toBeNull();
    expect(site.business.payments).toEqual([]);
    expect(site.business.certifications).toEqual([]);
    const json = JSON.stringify(site);
    expect(json).toContain("da € …");
    expect(json).toContain("WhatsApp us");
    expect(json).toContain("Via Esempio 12, 20100 Milano MI (sample)");
    expect(json).toContain("+39 02 0000 0000 (sample)");
    expect(json).toContain("Sample photo of a mechanic at work");
    expect(json).not.toMatch(/€\s*\d|\$\s*\d|\bASE\b|I-CAR|★/);
    expect(Object.values(site.assets).every((asset) => asset.source === "sample")).toBe(true);
    expect(site.theme.stickyHeader).toBe(true);
    const hero = site.pages[0]?.sections[0];
    expect(hero?.recipe).toBe("hero.split-photo");
    expect(hero?.fields.primaryCta).toMatchObject({ action: { type: "whatsapp" } });
  });

  it("keeps a US sample with call and text", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite(rossi);
    expect(site.business).toMatchObject({ name: "Rossi Auto Body", market: "US", phone: "+10000000000" });
    expect(site.business.address).toEqual({ street: "", city: "Chicago", region: "IL", country: "US" });
    const json = JSON.stringify(site);
    expect(json).toContain("from $…");
    expect(json).toContain("Chicago, IL");
    expect(site.pages[0]?.sections[0]?.fields.primaryCta).toMatchObject({ action: { type: "tel" } });
    expect(json).toContain("Text us");
  });

  it("lets the user override the detected market", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const site = await generateSite({ ...rossi, market: "IT" });
    expect(site.business.market).toBe("IT");
    expect(site.business.address.city).toBe("Chicago");
    expect(JSON.stringify(site)).toContain("da € …");
    expect(site.pages[0]?.sections[0]?.fields.primaryCta).toMatchObject({ action: { type: "whatsapp" } });
  });

  it("ignores invented prices from the model", async () => {
    vi.stubEnv("AI_API_KEY", "test-key");
    vi.stubEnv("AI_BASE_URL", "https://api.openai.com/v1");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      choices: [{ message: { content: JSON.stringify({
        copy: { heroHeadline: "Quiet repairs in Milano", "services.0.1": "from €250" },
      }) } }],
      usage: { prompt_tokens: 12, completion_tokens: 8 },
    })));
    const site = await generateSite(futura);
    const hero = site.pages[0]?.sections[0]?.fields.headline as { "en-US": string };
    expect(hero["en-US"]).toBe("Quiet repairs in Milano");
    expect(JSON.stringify(site)).not.toContain("250");
    expect(JSON.stringify(site)).toContain("da € …");
  });
});

describe("guards", () => {
  it("rejects prices, ratings, and certifications in model copy", () => {
    expect(safeCopy("Quiet repairs in Milano")).toBe(true);
    expect(safeCopy("from €250")).toBe(false);
    expect(safeCopy("ASE certified")).toBe(false);
    expect(safeCopy("4.9 stars")).toBe(false);
  });

  it("refuses private and insecure model endpoints", () => {
    expect(chatEndpoint("https://api.openai.com/v1").href).toBe("https://api.openai.com/v1/chat/completions");
    expect(() => chatEndpoint("http://localhost:11434/v1")).toThrow(/private|https/);
    expect(() => chatEndpoint("https://user:pass@api.openai.com/v1")).toThrow(/credential/);
    expect(() => chatEndpoint("http://api.openai.com/v1")).toThrow(/https/);
  });
});
