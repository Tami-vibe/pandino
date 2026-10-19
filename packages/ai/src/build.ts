import { validateSite, type Site } from "@pandino/schema";
import { themeFromBrand } from "@pandino/theme";
import copyBank from "../copy.json" with { type: "json" };
import shell from "../shell.json" with { type: "json" };
import { addressLine, mapQuery, type Profile } from "./profile";

const BLOCKED = /\d|€|\$|£|ase\b|i-?car|oem\b|certified|certification|★|\brating\b|\bstars?\b/i;

export const ALL_RECIPES = [
  "hero.split-photo",
  "pains.cards",
  "services.menu-from-prices",
  "services.process-insurance",
  "trust.reviews-certs",
  "trust.before-after",
  "convert.quote-booking",
  "footer.contact-map",
];

export function safeCopy(value: string) {
  const text = value.trim();
  return text.length >= 2 && text.length <= 180 && !BLOCKED.test(text) && !text.includes("{");
}

export function chooseRecipes(input: string[] | null) {
  const picked = new Set((input ?? ALL_RECIPES).filter((id) => ALL_RECIPES.includes(id)));
  for (const id of ["hero.split-photo", "convert.quote-booking", "footer.contact-map"]) picked.add(id);
  return ALL_RECIPES.filter((id) => picked.has(id));
}

export function buildSite(profile: Profile, brandColor: string, recipes: string[], extra: Record<string, string>): Site {
  const bank: Record<string, string> = { ...copyBank[profile.vertical] };
  for (const [key, value] of Object.entries(extra)) {
    if (key in bank && safeCopy(value)) bank[key] = value.trim();
  }
  const site = fillShell(varsFor(profile, bank)) as Site;
  site.theme = themeFromBrand(brandColor);
  site.pages[0]!.sections = site.pages[0]!.sections.filter((section) => recipes.includes(section.recipe));
  const parsed = validateSite(site);
  if (!parsed.success) throw new Error("Generated site failed validation");
  return parsed.data;
}

function varsFor(profile: Profile, bank: Record<string, string>) {
  const italian = profile.market === "IT";
  const vars: Record<string, string> = {
    ...profile,
    address: addressLine(profile),
    mapUrl: mapQuery(profile),
    contactLabel: italian ? "WhatsApp us" : "Call us",
    contactType: italian ? "whatsapp" : "tel",
    altLabel: italian ? "Call" : "Text us",
    altType: italian ? "tel" : "sms",
  };
  for (const [key, value] of Object.entries(bank)) {
    vars[key] = value.replaceAll("{city}", profile.city).replaceAll("{name}", profile.name);
  }
  return vars;
}

function fillShell(vars: Record<string, string>) {
  const raw = JSON.stringify(shell).replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (token, key: string) => {
    if (!(key in vars)) return token;
    return JSON.stringify(vars[key]).slice(1, -1);
  });
  if (raw.includes("{{")) throw new Error("Missing template value");
  return JSON.parse(raw) as unknown;
}

