import type { Site } from "@pandino/schema";
import { themeFromBrand } from "@pandino/theme";

type Fields = Site["pages"][number]["sections"][number]["fields"];

export function withFields(site: Site, id: string, fields: Fields): Site {
  const next = structuredClone(site);
  const section = next.pages.flatMap((page) => page.sections).find((item) => item.id === id);
  if (section) section.fields = fields;
  return next;
}

export function withBrand(site: Site, color: string): Site {
  return { ...site, theme: themeFromBrand(color) };
}

export function withBusiness(site: Site, business: Site["business"]): Site {
  return { ...structuredClone(site), business };
}

export function withMeta(site: Site, title: string, name: string): Site {
  const next = structuredClone(site);
  const page = next.pages[0];
  if (page) page.title = { ...page.title, [next.locales.default]: title };
  next.business = { ...next.business, name };
  return next;
}
