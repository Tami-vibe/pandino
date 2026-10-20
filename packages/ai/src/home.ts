import type { Site } from "@pandino/schema";
import bank from "../home.json" with { type: "json" };

type Section = Site["pages"][number]["sections"][number];

const ORDER: [string, string][] = [
  ["hero.split-photo", "fullscreen"],
  ["trust.logo-strip", "brands"],
  ["services.menu-from-prices", "grid"],
  ["trust.feature-split", "facility"],
  ["trust.facility-gallery", "filters"],
  ["pains.cards", "photos"],
  ["convert.journey", "tabs"],
  ["trust.stats", "row"],
  ["trust.badge-bar", "pills"],
  ["trust.reviews-certs", "cards"],
  ["convert.quote-booking", "split"],
  ["convert.faq", "split"],
  ["convert.offer", "banner"],
  ["footer.contact-map", "visit"],
  ["convert.cta-band", "band"],
];

export function homeSections(pool: Section[]): Section[] {
  return ORDER.flatMap(([recipe, variant], index) => {
    const found = pick(pool, recipe);
    return found ? [stamp(found, variant, index)] : [];
  });
}

export function sampleReviews(): Site["reviews"] {
  return bank.reviews as unknown as Site["reviews"];
}

function pick(pool: Section[], recipe: string) {
  const extra = (bank.sections as unknown as Section[]).find((section) => section.recipe === recipe);
  return pool.find((section) => section.recipe === recipe) ?? extra;
}

function stamp(section: Section, variant: string, index: number): Section {
  const copy = structuredClone(section);
  copy.id = `home_${index}`;
  copy.variant = variant;
  if (variant === "visit") copy.fields = { ...copy.fields, headline: { "en-US": "Visit us" } };
  return copy;
}
