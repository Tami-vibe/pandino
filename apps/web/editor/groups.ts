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
  primaryCta: "Primary button", secondaryCta: "Secondary button", priceLabel: "Price",
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
