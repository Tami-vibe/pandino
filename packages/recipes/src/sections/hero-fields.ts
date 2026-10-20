import { z } from "zod";

const text = z.record(z.string(), z.string().min(1));
const cta = z.object({
  label: text,
  action: z.object({
    type: z.enum(["open_form", "tel", "sms", "whatsapp", "url"]),
    formId: z.string().min(1).optional(),
    value: z.string().min(1).optional(),
  }),
  icon: z.enum(["call", "calendar_month", "arrow_forward", "mail", "directions_car"]).optional(),
});

const column = z.object({
  assetId: z.string().min(1).optional(),
  text: z.record(z.string(), z.string()).optional(),
  place: z.enum(["top", "center", "bottom"]).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const heroSplit = z.object({
  eyebrow: text,
  headline: text,
  subhead: text,
  primaryCta: cta,
  secondaryCta: cta,
  image: z.object({ assetId: z.string().min(1) }),
  look: z.object({ tlh: z.number(), tw: z.number(), ttr: z.number(), slh: z.number(), sw: z.number(), str: z.number(), sz: z.number() }).partial().optional(),
  shade: z.enum(["soft", "bottom", "strong"]).optional(),
  slides: z.array(z.string().min(1)).max(6).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  columns: z.enum(["1", "2", "3", "4"]).optional(),
  cols: z.array(column).max(4).optional(),
});
