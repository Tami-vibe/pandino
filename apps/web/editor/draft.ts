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
  const keep = site.theme;
  return { ...site, theme: { ...theme, stickyHeader: keep.stickyHeader, typeScale: keep.typeScale, fonts: keep.fonts, radius: keep.radius, header: keep.header, footer: keep.footer, border: keep.border } };
}

export function withTheme(site: Site, patch: Partial<Site["theme"]>): Site {
  return { ...site, theme: { ...site.theme, ...patch } };
}

export function withOrder(site: Site, slug: string, from: number, to: number): Site {
  const next = structuredClone(site);
  const page = next.pages.find((item) => item.slug === slug);
  const [section] = page?.sections.splice(from, 1) ?? [];
  if (page && section) page.sections.splice(to, 0, section);
  return next;
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
