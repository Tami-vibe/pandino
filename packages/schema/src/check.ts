import type { RefinementCtx } from "zod";

const LOCALE_KEY = /^[a-z]{2}-[A-Z]{2}$/;

type SiteShape = {
  locales: { default: string; enabled: string[] };
  assets: Record<string, unknown>;
  forms: Record<string, unknown>;
};

function issue(ctx: RefinementCtx, path: (string | number)[], message: string) {
  ctx.addIssue({ code: "custom", path, message });
}

export function checkSite(site: SiteShape, ctx: RefinementCtx) {
  if (!site.locales.enabled.includes(site.locales.default)) {
    issue(ctx, ["locales", "default"], "Default locale must be enabled");
  }
  walk(site, [], site, ctx);
}

function walk(value: unknown, path: (string | number)[], site: SiteShape, ctx: RefinementCtx) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...path, index], site, ctx));
    return;
  }
  if (value === null || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  const textMap = keys.every((key) => LOCALE_KEY.test(key) && typeof record[key] === "string");
  if (keys.length > 0 && textMap && !keys.includes(site.locales.default)) {
    issue(ctx, path, "Text is missing the default locale");
  }
  if (textMap) {
    for (const key of keys) {
      if (!site.locales.enabled.includes(key)) issue(ctx, [...path, key], "Locale is not enabled");
    }
  }

  for (const [key, child] of Object.entries(record)) {
    const table = key === "assetId" ? site.assets : key === "formId" ? site.forms : null;
    if (table && typeof child === "string" && !Object.hasOwn(table, child)) {
      issue(ctx, [...path, key], `Unknown ${key} ${child}`);
    }
    walk(child, [...path, key], site, ctx);
  }
}
