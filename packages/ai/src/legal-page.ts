import type { Site } from "@pandino/schema";

type Section = Site["pages"][number]["sections"][number];

export function legalPage(item: { slug: string; title: string; body: string }, locale: string) {
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

export function makePage(slug: string, title: string, nav: boolean, sections: Section[], locale: string) {
  const id = slug === "/" ? "home" : slug;
  return { id: `pg_${id}`, slug, title: { [locale]: title }, nav, sections };
}
