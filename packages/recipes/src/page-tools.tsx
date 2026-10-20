"use client";

import { useState } from "react";
import type { Site } from "@pandino/schema";

type Page = Site["pages"][number];

export function PageTools({ site, page, onSite, onPage }: { site: Site; page: Page; onSite: (next: Site) => void; onPage: (slug: string) => void }) {
  const locale = site.locales.default;
  const parents = site.pages.filter((item) => item.nav && item.slug !== page.slug && !item.parent);
  const add = (nav: boolean) => { const made = addPage(site, nav ? "New menu item" : "New page", nav); onSite(made.site); onPage(made.slug); };
  return (
    <>
      <SeoName pageId={page.id} name={page.title[locale] ?? ""} onName={(name) => onSite(renamePage(site, page.id, name))} />
      <label className="edit"><span>In the header</span><select className="studio-input" aria-label="In the header" value={page.nav ? "yes" : "no"} onChange={(event) => onSite(setNav(site, page.id, event.target.value === "yes"))}><option value="yes">Yes</option><option value="no">No</option></select></label>
      <label className="edit"><span>Submenu of</span><select className="studio-input" aria-label="Submenu of" value={page.parent ?? ""} onChange={(event) => onSite(setParent(site, page.id, event.target.value))}><option value="">None</option>{parents.map((item) => <option key={item.id} value={item.slug}>{item.title[locale] ?? item.slug}</option>)}</select></label>
      <div className="edit page-add"><button type="button" className="studio-input" onClick={() => add(false)}>Add page</button><button type="button" className="studio-input" onClick={() => add(true)}>Add menu item</button></div>
    </>
  );
}

export function seoTitle(site: Site, slug: string) {
  const name = (site.pages.find((item) => item.slug === slug) ?? site.pages[0])?.title[site.locales.default];
  return [name, site.business.name].filter((item, index, list) => item && list.indexOf(item) === index).join(" · ");
}

function SeoName({ pageId, name, onName }: { pageId: string; name: string; onName: (value: string) => void }) {
  const [value, setValue] = useState(name);
  const [seen, setSeen] = useState(pageId);
  if (seen !== pageId) { setSeen(pageId); setValue(name); }
  return <label className="edit"><span>SEO name</span><input className="studio-input" aria-label="SEO name" value={value} onChange={(event) => { const next = event.target.value; setValue(next); if (next.trim()) onName(next); }} onBlur={() => { if (!value.trim()) setValue(name); }} /></label>;
}

function renamePage(site: Site, id: string, name: string): Site {
  const next = structuredClone(site);
  const page = next.pages.find((item) => item.id === id);
  const clean = name.trim();
  const locale = next.locales.default;
  const previous = page?.title[locale];
  if (page && clean) page.title = { ...page.title, [locale]: clean };
  for (const section of page?.sections ?? []) for (const key of ["headline", "body"] as const) {
    const value = section.fields[key];
    if (previous && clean && value && typeof value === "object" && !Array.isArray(value) && value[locale] === previous) section.fields[key] = { ...value, [locale]: clean };
  }
  return next;
}

function setNav(site: Site, id: string, nav: boolean): Site {
  const next = structuredClone(site);
  const page = next.pages.find((item) => item.id === id);
  if (page) page.nav = nav;
  return next;
}

function setParent(site: Site, id: string, parent: string): Site {
  const next = structuredClone(site);
  const page = next.pages.find((item) => item.id === id);
  if (page) { if (parent && parent !== page.slug) page.parent = parent; else delete page.parent; }
  return next;
}

function addPage(site: Site, name: string, nav: boolean) {
  const next = structuredClone(site);
  const locale = next.locales.default;
  const slug = uniqueSlug(next, name);
  const text = { [locale]: name };
  const section: Page["sections"][number] = { id: `sec_${slug}`, group: "legal", recipe: "legal.template", recipeVersion: 1, variant: "page", fields: { headline: text, body: text }, style: { background: "none", overlay: 0 } };
  next.pages.push({ id: `pg_${slug}`, slug, title: text, nav, sections: [section] });
  return { site: next, slug };
}

function uniqueSlug(site: Site, name: string) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "page";
  const taken = new Set(site.pages.map((page) => page.slug));
  let slug = base, n = 2;
  while (taken.has(slug)) slug = `${base.slice(0, 36)}-${n++}`;
  return slug;
}
