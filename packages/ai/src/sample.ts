import { validateSite, type Site } from "@pandino/schema";

const PHONE = "+390200000000";

const SHOTS: Record<string, [string, string]> = {
  ast_hero: ["https://pandino.invalid/media/hero/hero-1.jpg", "Sample photo of a person with a car. Not this shop."],
  ast_before: ["https://pandino.invalid/media/hero/before.jpg", "Sample photo of an open engine bay before repair. Not this shop."],
  ast_after: ["https://pandino.invalid/media/hero/after.jpg", "Sample photo of a polished car after paint. Not this shop."],
  ast_shop: ["https://pandino.invalid/media/showcase/workshop-bay.jpg", "Sample photo of a repair shop interior. Not this shop."],
};

export function dressSample(site: Site): Site {
  const futura = /futura/i.test(site.business.name) && /milano/i.test(site.business.address.city);
  if (!futura) return site;
  const next = structuredClone(site);
  next.business.phone = PHONE;
  next.business.whatsapp = PHONE;
  next.business.email = "info@futura-example.it";
  next.business.address = { ...next.business.address, street: "Via Esempio 12" };
  next.business.hours = "Mon–Fri 8:00–18:00 (sample)";
  next.business.vat = "IT00000000000 (sample)";
  next.business.socials = {
    facebook: "https://example.com/futura",
    instagram: "https://example.com/futura",
    tiktok: "https://example.com/futura",
    youtube: "https://example.com/futura",
    google: "https://example.com/futura",
  };
  paint(next);
  const parsed = validateSite(next);
  if (!parsed.success) throw new Error("Sample site failed validation");
  return parsed.data;
}

function paint(site: Site) {
  const locale = site.locales.default;
  for (const [id, [src, alt]] of Object.entries(SHOTS)) {
    site.assets[id] = { type: "image", src, alt: { [locale]: alt }, source: "sample", width: 1600, height: 1067 };
  }
  for (const section of site.pages.flatMap((page) => page.sections)) {
    if (section.recipe === "hero.split-photo") section.style = { background: "image", overlay: 0.55 };
    if (section.recipe === "trust.before-after") {
      section.fields = {
        ...section.fields,
        subhead: { [locale]: "Sample photos, not this shop." },
        caption: { [locale]: "Sample photos of body work. Replace them with real before and after photos." },
      };
    }
    if (section.recipe === "footer.contact-map") {
      section.fields = {
        ...section.fields,
        phoneDisplay: { [locale]: "+39 02 0000 0000 (sample)" },
        phoneNote: { [locale]: "Sample number. Replace it before you publish." },
        address: { [locale]: "Via Esempio 12, 20100 Milano MI (sample)" },
        hours: { [locale]: "Mon–Fri 8:00–18:00 (sample)" },
      };
    }
  }
}
