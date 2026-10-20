"use client";

import { useState } from "react";
import type { Site } from "@pandino/schema";

type Page = Site["pages"][number];

export function MenuAdd({ site, onSite, onPage }: { site: Site; onSite: (next: Site) => void; onPage: (slug: string) => void }) {
  const locale = site.locales.default;
  const [words, setWords] = useState("");
  const [opens, setOpens] = useState("new");
  const [place, setPlace] = useState("");
  const [seo, setSeo] = useState("");
  const [touched, setTouched] = useState(false);
  const label = words.trim();
  const suggested = suggestSeo(site, label || "New page");
  const seoValue = touched ? seo : suggested;
  const target = site.pages.find((item) => item.id === opens);
  const locked = !!target && site.pages.some((item) => item.parent === target.slug);
  const parents = site.pages.filter((item) => item.nav && !item.parent && item.id !== opens);
  const add = () => {
    if (!label) return;
    if (opens === "new") {
      const made = addLinkedPage(site, label, seoValue.trim() || suggested, locked ? "" : place);
      onSite(made.site);
      onPage(made.slug);
    } else if (target) {
      onSite(linkPage(site, target.id, label, locked ? "" : place));
      onPage(target.slug);
    }
    setWords(""); setOpens("new"); setPlace(""); setSeo(""); setTouched(false);
  };
  return (
    <details className="edit menu-add">
      <summary>Add menu item</summary>
      <label className="edit"><span>Menu words</span><input className="studio-input" aria-label="Menu words" value={words} placeholder="Rental Lux Cars" onChange={(event) => setWords(event.target.value)} /></label>
      <label className="edit"><span>Opens this page</span><select className="studio-input" aria-label="Opens this page" value={opens} onChange={(event) => setOpens(event.target.value)}><option value="new">Create a new page</option>{site.pages.map((item) => <option key={item.id} value={item.id}>{item.menu || item.title[locale] || item.slug}</option>)}</select></label>
      {opens === "new" ? <p className="hint">No page for this link yet. A new page uses the menu words. You can change the SEO name.</p> : <p className="hint">This link opens the page you picked. It does not create another page.</p>}
      {opens === "new" ? <label className="edit"><span>SEO name</span><input className="studio-input" aria-label="SEO name suggestion" value={seoValue} onChange={(event) => { setTouched(true); setSeo(event.target.value); }} /></label> : null}
      <label className="edit"><span>Show it</span><select className="studio-input" aria-label="Show it" value={locked ? "" : place} disabled={locked} onChange={(event) => setPlace(event.target.value)}><option value="">On its own in the header</option>{parents.map((item) => <option key={item.id} value={item.slug}>{item.menu || item.title[locale] || item.slug}</option>)}</select></label>
      {locked ? <p className="hint">This page already holds other menu items, so it stays on its own.</p> : null}
      <button type="button" className="studio-input" onClick={add} disabled={!label}>Add to the header</button>
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

function addLinkedPage(site: Site, label: string, seo: string, parent: string) {
  const next = structuredClone(site);
  const locale = next.locales.default;
  const slug = uniqueSlug(next, label);
  const words = { [locale]: label };
  const section: Page["sections"][number] = { id: `sec_${slug}`, group: "legal", recipe: "legal.template", recipeVersion: 1, variant: "page", fields: { headline: words, body: words }, style: { background: "none", overlay: 0 } };
  const page: Page = { id: `pg_${slug}`, slug, title: { [locale]: seo }, menu: label, nav: true, sections: [section] };
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
