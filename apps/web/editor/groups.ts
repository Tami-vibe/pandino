export const GROUPS = [
  { id: "pages", icon: "storefront", label: "Pages", title: "Pages" },
  { id: "style", icon: "palette", label: "Style", title: "Brand & Styling" },
  { id: "hero", icon: "auto_stories", label: "Hero", title: "Hook & Story" },
  { id: "pains", icon: "sentiment_dissatisfied", label: "Pains", title: "Pains & Problems" },
  { id: "services", icon: "construction", label: "Services", title: "Solutions & Services" },
  { id: "trust", icon: "verified", label: "Trust", title: "Trust & Proof" },
  { id: "convert", icon: "ads_click", label: "Convert", title: "Conversion" },
  { id: "footer", icon: "call_to_action", label: "Footer", title: "Footer" },
] as const;

export type RailId = (typeof GROUPS)[number]["id"];

export function isGroup(value: string): value is RailId {
  return GROUPS.some((item) => item.id === value);
}

const NAMES: Record<string, string> = {
  primaryCta: "Primary button", secondaryCta: "Hero button", priceLabel: "Price",
  phoneDisplay: "Phone", phoneNote: "Phone note", mapLabel: "Map link", mapUrl: "Map URL",
  submitLabel: "Button", photoNote: "Photo note", certificationsNote: "Certifications", altContact: "Other contact",
};

export function fieldLabel(name: string) {
  const known = NAMES[name];
  if (known) return known;
  const spaced = name.replace(/([A-Z])/g, " $1").replace(/[.-]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function recipeLabel(recipe: string) {
  return fieldLabel(recipe.split(".")[1] ?? recipe);
}

const ICONS: Record<string, string> = {
  "hero.split-photo": "auto_stories",
  "pains.cards": "sentiment_dissatisfied",
  "services.menu-from-prices": "construction",
  "services.process-insurance": "description",
  "trust.reviews-certs": "verified",
  "trust.before-after": "photo_camera",
  "trust.logo-strip": "directions_car",
  "trust.feature-split": "storefront",
  "trust.facility-gallery": "photo_camera",
  "trust.stats": "verified",
  "trust.badge-bar": "check_circle",
  "convert.quote-booking": "request_quote",
  "convert.journey": "schedule",
  "convert.faq": "chat",
  "convert.offer": "payments",
  "convert.cta-band": "call_to_action",
  "footer.contact-map": "location_on",
  "legal.template": "lock",
};

export function sectionIcon(recipe: string) {
  return ICONS[recipe] ?? "deployed_code";
}
