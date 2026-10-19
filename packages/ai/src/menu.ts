import type { Site } from "@pandino/schema";

type Section = Site["pages"][number]["sections"][number];
type Item = { name: Record<string, string>; detail: Record<string, string>; priceLabel: Record<string, string>; duration: Record<string, string> };

export function menuSections(pool: Section[], vertical: string, locale: string) {
  const menu = pool.find((section) => section.recipe === "services.menu-from-prices");
  return menu ? splitMenu(structuredClone(menu), vertical, locale) : [];
}

function splitMenu(section: Section, vertical: string, locale: string) {
  const items = ((section.fields as { items?: Item[] }).items ?? []).map((item) => renameDent(item, locale));
  const names = items.map((item) => item.name[locale] ?? "").join(" ").toLowerCase();
  if (vertical === "body_shop" && !names.includes("glass")) items.push(extra(locale, "Glass"));
  if ((vertical === "body_shop" || vertical === "glass_shop") && !names.includes("adas")) items.push(extra(locale, "ADAS calibration"));
  return items.map((item, index) => ({
    ...section,
    id: `${section.id}_${index}`,
    fields: { headline: item.name, subhead: item.detail, items: [item] },
  }));
}

function renameDent(item: Item, locale: string): Item {
  if (item.name[locale] !== "Dent removal") return item;
  return { ...item, name: { ...item.name, [locale]: "Dent / PDR" } };
}

function extra(locale: string, name: string): Item {
  const line = (value: string) => ({ [locale]: value });
  return {
    name: line(name),
    detail: line("Add this service only if you offer it."),
    priceLabel: line("Add your price"),
    duration: line("Add a typical duration"),
  };
}
