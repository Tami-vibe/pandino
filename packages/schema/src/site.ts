import { z } from "zod";
import { businessSchema } from "./business";
import { checkSite } from "./check";
import { RECIPES } from "./recipes";
import { reviewsSchema } from "./reviews";

const locale = z.string().regex(/^[a-z]{2}-[A-Z]{2}$/);
const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
const id = z.string().min(1);
const text = z.record(locale, z.string().min(1));

const asset = z.strictObject({
  type: z.enum(["image", "video"]),
  src: z.url(),
  alt: text,
  source: z.enum(["library", "owner", "placeholder", "sample"]),
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
  group: z.enum(["hero", "pains", "services", "trust", "convert", "footer", "legal"]),
  recipe: z.enum(RECIPES),
  recipeVersion: z.number().int().positive(),
  variant: id,
  fields: z.record(z.string(), z.json()),
  style: z.strictObject({ background: id, overlay: z.number().min(0).max(1) }),
});

const page = z.strictObject({ id, slug: id, title: text, nav: z.boolean().default(true), sections: z.array(section) });

export const siteSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    siteId: id,
    workspaceId: id,
    locales: z.strictObject({ default: locale, enabled: z.array(locale).min(1) }),
    business: businessSchema,
    theme: z.strictObject({
      brandColor: hex,
      vibe: id,
      palette: z.strictObject({ primary: hex, onPrimary: hex, surface: hex, text: hex }),
      fonts: z.strictObject({ heading: id, body: id }),
      radius: id,
      spacing: id,
      stickyHeader: z.boolean().default(true),
      typeScale: z.number().min(0.85).max(1.25).default(1),
      chrome: z.strictObject({
        header: z.enum(["bar", "pill"]).default("bar"),
        tone: z.enum(["dark", "white"]).default("dark"),
        review: z.enum(["dark", "white"]).default("dark"),
        ctas: z.union([z.literal(0), z.literal(1), z.literal(2)]).default(2),
        place: z.enum(["in", "out"]).default("out"),
      }).default({ header: "bar", tone: "dark", review: "dark", ctas: 2, place: "out" }),
    }),
    pages: z.array(page).min(1),
    assets: z.record(id, asset),
    forms: z.record(id, form),
    reviews: reviewsSchema,
  })
  .superRefine(checkSite);

export type Site = z.infer<typeof siteSchema>;

export function validateSite(input: unknown) {
  return siteSchema.safeParse(input);
}

export function siteJsonSchema() {
  return z.toJSONSchema(siteSchema);
}
