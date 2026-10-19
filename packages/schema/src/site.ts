import { z } from "zod";
import { checkSite } from "./check";

const locale = z.string().regex(/^[a-z]{2}-[A-Z]{2}$/);
const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
const id = z.string().min(1);
const text = z.record(locale, z.string().min(1));
const recipes = [
  "hero.split-photo", "pains.cards", "services.menu-from-prices", "services.process-insurance",
  "trust.reviews-certs", "trust.before-after", "convert.quote-booking", "footer.contact-map",
] as const;

const asset = z.strictObject({
  type: z.literal("image"),
  src: z.url(),
  alt: text,
  source: z.enum(["library", "owner", "placeholder"]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const form = z.strictObject({
  kind: z.enum(["lead", "quote", "booking"]),
  photoUpload: z.boolean().optional(),
  consent: z.array(z.enum(["contact", "marketing_optional"])),
});

const section = z.strictObject({
  id,
  group: z.enum(["hero", "pains", "services", "trust", "convert", "footer"]),
  recipe: z.enum(recipes),
  recipeVersion: z.number().int().positive(),
  variant: id,
  fields: z.record(z.string(), z.json()),
  style: z.strictObject({ background: id, overlay: z.number().min(0).max(1) }),
});

const page = z.strictObject({ id, slug: id, title: text, sections: z.array(section) });

export const siteSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    siteId: id,
    workspaceId: id,
    locales: z.strictObject({ default: locale, enabled: z.array(locale).min(1) }),
    business: z.strictObject({
      name: id, vertical: z.enum(["garage", "body_shop", "tyre_shop", "glass_shop"]),
      market: z.enum(["US", "IT"]), phone: z.string().regex(/^\+[1-9]\d{6,14}$/),
      whatsapp: z.string().regex(/^$|^\+[1-9]\d{6,14}$/), email: z.string(),
      address: z.strictObject({ street: z.string(), city: id, region: id, country: z.string().regex(/^[A-Z]{2}$/) }),
      hours: z.string(), googleReviewsUrl: z.string(), warranty: z.string(),
      googleRating: z.number().min(1).max(5).nullable(), googleReviewCount: z.number().int().nonnegative().nullable(),
      payments: z.array(z.string()), certifications: z.array(id),
    }),
    theme: z.strictObject({
      brandColor: hex,
      vibe: id,
      palette: z.strictObject({ primary: hex, onPrimary: hex, surface: hex, text: hex }),
      fonts: z.strictObject({ heading: id, body: id }),
      radius: id,
      spacing: id,
    }),
    pages: z.array(page).min(1),
    assets: z.record(id, asset),
    forms: z.record(id, form),
  })
  .superRefine(checkSite);

export type Site = z.infer<typeof siteSchema>;

export function validateSite(input: unknown) {
  return siteSchema.safeParse(input);
}

export function siteJsonSchema() {
  return z.toJSONSchema(siteSchema);
}
