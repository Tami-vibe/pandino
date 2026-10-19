import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteJsonSchema, validateSite } from "./site";

function example(): Record<string, unknown> {
  const url = new URL("../examples/rossi-auto-body.json", import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as Record<string, unknown>;
}

describe("site schema", () => {
  it("accepts the Rossi Auto Body example", () => {
    const result = validateSite(example());
    expect(result.success).toBe(true);
  });

  it("exports JSON Schema for structured output", () => {
    const json = siteJsonSchema() as { properties?: Record<string, unknown> };
    expect(json.properties).toHaveProperty("schemaVersion");
    expect(json.properties).toHaveProperty("pages");
    expect(json.properties).toHaveProperty("business");
  });

  it("rejects a different schema version", () => {
    const site = example();
    site.schemaVersion = 2;
    expect(validateSite(site).success).toBe(false);
  });

  it("rejects a default locale that is not enabled", () => {
    const site = example();
    site.locales = { default: "it-IT", enabled: ["en-US"] };
    expect(validateSite(site).success).toBe(false);
  });

  it("rejects an unknown asset and an unknown form", () => {
    const missingAsset = example();
    const pages = missingAsset.pages as { sections: { fields: { image: { assetId: string } } }[] }[];
    pages[0]!.sections[0]!.fields.image.assetId = "ast_missing";
    expect(validateSite(missingAsset).success).toBe(false);

    const missingForm = example();
    const formPages = missingForm.pages as {
      sections: { fields: { primaryCta: { action: { formId: string } } } }[];
    }[];
    formPages[0]!.sections[0]!.fields.primaryCta.action.formId = "frm_missing";
    expect(validateSite(missingForm).success).toBe(false);
  });

  it("rejects visitor text that omits the default locale", () => {
    const site = example();
    const pages = site.pages as { title: Record<string, string> }[];
    pages[0]!.title = { "it-IT": "Casa" };
    expect(validateSite(site).success).toBe(false);
  });

  it("allows a shop with no certifications", () => {
    const site = example();
    (site.business as { certifications: string[] }).certifications = [];
    expect(validateSite(site).success).toBe(true);
  });

  it("rejects an unknown vertical", () => {
    const site = example();
    (site.business as { vertical: string }).vertical = "dealership";
    expect(validateSite(site).success).toBe(false);
  });
});
