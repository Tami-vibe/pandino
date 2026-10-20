"use client";

import { useState } from "react";
import type { Site } from "@pandino/schema";

type Page = Site["pages"][number];

export function MenuAdd({ site, onSite, onPage }: { site: Site; onSite: (next: Site) => void; onPage: (slug: string) => void }) {
  const locale = site.locales.default;
  const [words, setWords] = useState("");
  const [mode, setMode] = useState("new");
  const [pageId, setPageId] = useState("");
  const [name, setName] = useState("");
  const [named, setNamed] = useState(false);
  const [place, setPlace] = useState("");
  const label = words.trim();
  const pageName = (named ? name : words).trim();
  const target = site.pages.find((item) => item.id === pageId) ?? site.pages[0];
  const locked = mode === "link" && !!target && site.pages.some((item) => item.parent === target.slug);
  const parents = site.pages.filter((item) => item.nav && !item.parent && (mode !== "link" || item.id !== target?.id));
  const ready = Boolean(label && (mode === "link" ? target : pageName && pageName.toLowerCase() !== "create new page"));
  const add = () => {
    if (!ready) return;
    const parent = locked ? "" : place;
    if (mode === "new") { const made = addLinkedPage(site, label, pageName, parent); onSite(made.site); onPage(made.slug); }
    else if (target) { onSite(linkPage(site, target.id, label, parent)); onPage(target.slug); }
    setWords(""); setMode("new"); setPageId(""); setName(""); setNamed(false); setPlace("");
  };
  const title = (item: Page) => item.menu || item.title[locale] || item.slug;
  return (
    <details className="edit menu-add" open>
      <summary>Add menu item</summary>
      <label className="edit"><span>Menu words</span><input className="studio-input" aria-label="Menu words" value={words} placeholder="Rental Lux Cars" onChange={(event) => setWords(event.target.value)} /></label>
      <label className="edit"><span>Page</span><select className="studio-input" aria-label="Page" value={mode} onChange={(event) => setMode(event.target.value)}><option value="link">Link existing page</option><option value="new">Create new page</option></select></label>
      {mode === "link"
        ? <label className="edit"><span>Existing page</span><select className="studio-input" aria-label="Existing page" value={target?.id ?? ""} onChange={(event) => setPageId(event.target.value)}>{site.pages.map((item) => <option key={item.id} value={item.id}>{title(item)}</option>)}</select></label>
        : <label className="edit"><span>Page name / title</span><input className="studio-input" aria-label="Page name / title" value={named ? name : words} placeholder="Rental Lux Cars" onChange={(event) => { setNamed(true); setName(event.target.value); }} /></label>}
      <label className="edit"><span>Place</span><select className="studio-input" aria-label="Place" value={locked ? "" : place} disabled={locked} onChange={(event) => setPlace(event.target.value)}><option value="">Top-level header item</option>{parents.map((item) => <option key={item.id} value={item.slug}>{title(item)}</option>)}</select></label>
      {locked ? <p className="hint">This page already holds other items, so it stays top-level.</p> : null}
      <button type="button" className="studio-input" onClick={add} disabled={!ready}>Add to the header</button>
    </details>
  );
}

function suggestSeo(site: Site, words: string) {
  const city = site.business.address.city.trim();
  const shop = site.business.name.trim();
  const place = city ? `${words} in ${city}` : words;
  return shop && shop !== words ? `${place} | ${shop}` : place;
}

function linkPage(site: Site, id: string, label: string, parent: string): Site {
  const next = structuredClone(site);
  const page = next.pages.find((item) => item.id === id);
  if (!page) return next;
  const hasKids = next.pages.some((item) => item.parent === page.slug);
  page.menu = label;
  page.nav = true;
  if (parent && parent !== page.slug && !hasKids) page.parent = parent;
  else delete page.parent;
  return next;
}

function addLinkedPage(site: Site, label: string, pageName: string, parent: string) {
  const next = structuredClone(site);
  const locale = next.locales.default;
  const slug = uniqueSlug(next, pageName);
  const words = { [locale]: pageName };
  const section: Page["sections"][number] = { id: `sec_${slug}`, group: "legal", recipe: "legal.template", recipeVersion: 1, variant: "page", fields: { headline: words, body: words }, style: { background: "none", overlay: 0 } };
  const page: Page = { id: `pg_${slug}`, slug, title: { [locale]: suggestSeo(next, pageName) }, menu: label, nav: true, sections: [section] };
  if (parent && next.pages.some((item) => item.slug === parent && !item.parent)) page.parent = parent;
  next.pages.push(page);
  return { site: next, slug };
}

function uniqueSlug(site: Site, name: string) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "page";
  const taken = new Set(site.pages.map((page) => page.slug));
  let slug = base, n = 2;
  while (taken.has(slug)) slug = `${base.slice(0, 36)}-${n++}`;
  return slug;
}
