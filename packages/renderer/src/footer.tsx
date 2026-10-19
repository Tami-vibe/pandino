import type { Site } from "@pandino/schema";
import { pageHref, placeLine, phoneLabel } from "@pandino/recipes";
import { Socials } from "./socials";

type Mode = "file" | "pretty";
type Link = { href: string; label: string };

export function SiteFooter({ site, links }: { site: Site; links: Mode }) {
  const locale = site.locales.default;
  const nav = site.pages.filter((page) => page.nav).map((page) => ({ href: pageHref(page.slug, links), label: page.title[locale] ?? page.slug }));
  const legal = site.pages.filter((page) => !page.nav && page.slug !== "estimate").map((page) => ({ href: pageHref(page.slug, links), label: page.title[locale] ?? page.slug }));
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <p className="wordmark">{site.business.name}</p>
          <p>{blurb(site)}</p>
          <p>{placeLine(site)}</p>
          <p>{phoneLabel(site)}</p>
          <p>{site.business.hours.trim() || "Add your opening hours"}</p>
          {site.business.market === "IT" ? <p className="vat">{vatLine(site)}</p> : null}
        </div>
        <LinkList title="Services" items={serviceLinks(site, links)} />
        <LinkList title="Pages" items={nav} />
        <div>
          <LinkList title="Legal" items={legal} />
          <Socials site={site} />
          <p className="note">© {new Date().getFullYear()} {site.business.name}</p>
        </div>
      </div>
    </footer>
  );
}

function LinkList({ title, items }: { title: string; items: Link[] }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>{items.map((item) => <li key={`${item.href}:${item.label}`}><a href={item.href}>{item.label}</a></li>)}</ul>
    </div>
  );
}

function blurb(site: Site) {
  const hero = site.pages.flatMap((page) => page.sections).find((section) => section.recipe === "hero.split-photo");
  const sub = hero?.fields.subhead as Record<string, string> | undefined;
  return sub?.[site.locales.default] ?? site.business.name;
}

function serviceLinks(site: Site, links: Mode): Link[] {
  const page = site.pages.find((item) => item.slug === "services");
  return (page?.sections ?? []).flatMap((section) => {
    const items = section.fields.items as { name?: Record<string, string> }[] | undefined;
    return (items ?? []).map((item) => ({
      href: `${pageHref("services", links)}#${section.id}`,
      label: item.name?.[site.locales.default] ?? "Service",
    }));
  });
}

function vatLine(site: Site) {
  const vat = site.business.vat.trim() || "[P.IVA]";
  return `P.IVA ${vat}. Registered office [registered office]. REA [REA]. Share capital [share capital].`;
}
