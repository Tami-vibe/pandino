import { z } from "zod";

const blank = z.string().default("");

export const businessSchema = z.strictObject({
  name: z.string().min(1),
  vertical: z.enum(["garage", "body_shop", "tyre_shop", "glass_shop"]),
  market: z.enum(["US", "IT"]),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/),
  whatsapp: z.string().regex(/^$|^\+[1-9]\d{6,14}$/),
  email: z.string(),
  address: z.strictObject({
    street: z.string(),
    city: z.string().min(1),
    region: z.string().min(1),
    country: z.string().regex(/^[A-Z]{2}$/),
  }),
  hours: z.string(),
  googleReviewsUrl: z.string(),
  warranty: z.string(),
  googleRating: z.number().min(1).max(5).nullable(),
  googleReviewCount: z.number().int().nonnegative().nullable(),
  payments: z.array(z.string()),
  certifications: z.array(z.string().min(1)),
  vat: blank,
  socials: z.strictObject({
    facebook: blank,
    instagram: blank,
    tiktok: blank,
    youtube: blank,
    google: blank,
  }).default({ facebook: "", instagram: "", tiktok: "", youtube: "", google: "" }),
});
