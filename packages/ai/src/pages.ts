import { validateSite, type Site } from "@pandino/schema";
import legalCopy from "../legal.json" with { type: "json" };

type Section = Site["pages"][number]["sections"][number];
type Item = { name: Record<string, string>; detail: Record<string, string>; priceLabel: Record<string, string>; duration: Record<string, string> };

const NAV = [
  ["/", "Home", ["hero.split-photo", "pains.cards"]],
  ["services", "Services", ["services.menu-from-prices"]],
  ["process", "Process & Warranty", ["services.process-insurance"]],
  ["gallery", "Gallery & Reviews", ["trust.reviews-certs", "trust.before-after"]],
  ["contact", "About & Contact", ["footer.contact-map"]],
] as const;

export function spreadPages(site: Site): Site {
  const next = structuredClone(site);
  const locale = next.locales.default;
  const sections = next.pages.flatMap((page) => page.sections);
  const pages = NAV.map(([slug, title, recipes]) => makePage(slug, title, true, take(sections, recipes, next.business.vertical, locale), locale));
  pages.push(makePage("estimate", "Get an estimate", false, take(sections, ["convert.quote-booking"], next.business.vertical, locale), locale));
  for (const item of legalCopy[next.business.market]) pages.push(legalPage(item, locale));
  next.pages = pages.filter((page) => page.sections.length > 0);
  const parsed = validateSite(next);
  if (!parsed.success) throw new Error("Paged site failed validation");
  return parsed.data;
}

function take(sections: Section[], recipes: readonly string[], vertical: string, locale: string) {
  return recipes.flatMap((recipe) => {
    const found = sections.filter((section) => section.recipe === recipe);
    return recipe === "services.menu-from-prices" ? found.flatMap((section) => splitMenu(section, vertical, locale)) : found;
  });
}

function splitMenu(section: Section, vertical: string, locale: string) {
  const fields = section.fields as { items?: Item[] };
  const items = (fields.items ?? []).map((item) => renameDent(item, locale));
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

function makePage(slug: string, title: string, nav: boolean, sections: Section[], locale: string) {
  const id = slug === "/" ? "home" : slug;
  return { id: `pg_${id}`, slug, title: { [locale]: title }, nav, sections };
}

function legalPage(item: { slug: string; title: string; body: string }, locale: string) {
  const text = (value: string) => ({ [locale]: value });
  const section: Section = {
    id: `sec_${item.slug}`,
    group: "legal",
    recipe: "legal.template",
    recipeVersion: 1,
    variant: "prose",
    fields: { headline: text(item.title), body: text(item.body) },
    style: { background: "none", overlay: 0 },
  };
  return makePage(item.slug, item.title, false, [section], locale);
}
