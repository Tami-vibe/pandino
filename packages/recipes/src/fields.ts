import { z } from "zod";
import { heroSplit } from "./sections/hero-fields";

const text = z.record(z.string(), z.string().min(1));

export const actionSchema = z.object({
  type: z.enum(["open_form", "tel", "sms", "whatsapp", "url"]),
  formId: z.string().min(1).optional(),
  value: z.string().min(1).optional(),
});

const cta = z.object({ label: text, action: actionSchema, icon: z.enum(["call", "calendar_month", "arrow_forward", "mail", "directions_car"]).optional() });
const card = z.object({ title: text, body: text });

export const recipeFields = {
  "hero.split-photo": heroSplit,
  "pains.cards": z.object({
    headline: text,
    subhead: text,
    items: z.array(card).min(1),
  }),
  "services.menu-from-prices": z.object({
    headline: text,
    subhead: text,
    items: z.array(z.object({
      name: text,
      detail: text,
      priceLabel: text,
      duration: text,
    })).min(1),
    perRow: z.enum(["2", "3", "4"]).optional(),
  }),
  "services.process-insurance": z.object({
    headline: text,
    subhead: text,
    steps: z.array(card).min(1),
    note: text,
  }),
  "trust.reviews-certs": z.object({
    headline: text,
    subhead: text,
    reviews: z.array(z.object({
      quote: text,
      author: text,
      placeholder: z.literal(true),
    })).min(1),
    certificationsNote: text,
  }),
  "trust.before-after": z.object({
    headline: text,
    subhead: text,
    before: z.object({ assetId: z.string().min(1) }),
    after: z.object({ assetId: z.string().min(1) }),
    caption: text,
  }),
  "convert.quote-booking": z.object({
    headline: text,
    subhead: text,
    formId: z.string().min(1),
    submitLabel: text,
    photoNote: text,
  }),
  "footer.contact-map": z.object({
    hours: text,
    address: text,
    phoneDisplay: text,
    phoneNote: text,
    mapLabel: text,
    mapUrl: z.string().min(1),
    contact: cta,
    altContact: cta,
    share: cta,
  }),
};

export type Action = z.infer<typeof actionSchema>;
