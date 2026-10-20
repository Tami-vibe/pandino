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
  const theme = themeFromBrand(color);
  return { ...site, theme: { ...theme, stickyHeader: site.theme.stickyHeader, typeScale: site.theme.typeScale, chrome: site.theme.chrome } };
}

export function withTheme(site: Site, patch: Partial<Site["theme"]>): Site {
  return { ...site, theme: { ...site.theme, ...patch } };
}

export function withStyle(site: Site, id: string, style: Site["pages"][number]["sections"][number]["style"]): Site {
  const next = structuredClone(site);
  const section = next.pages.flatMap((page) => page.sections).find((item) => item.id === id);
  if (section) section.style = style;
  return next;
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
