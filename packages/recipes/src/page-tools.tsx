"use client";

import { useState } from "react";
import type { Site } from "@pandino/schema";
import { MenuAdd } from "./menu-add";

type Page = Site["pages"][number];

export function PageTools({ site, page, onSite, onPage, onPending }: { site: Site; page: Page; onSite: (next: Site) => void; onPage: (slug: string) => void; onPending: (next: Site | null, slug?: string) => void }) {
  const locale = site.locales.default;
  return (
    <>
      <SeoName pageId={page.id} name={page.title[locale] ?? ""} onName={(name) => onSite(renamePage(site, page.id, name))} />
      <MenuAdd site={site} onSite={onSite} onPage={onPage} onPending={onPending} />
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


