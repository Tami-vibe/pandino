import type { CSSProperties } from "react";
import type { Site } from "@pandino/schema";
import { Recipe, StickyBar, actionHref, liveAction, tx } from "@pandino/recipes";
import type { Action } from "@pandino/recipes/fields";

const NAV: Record<string, string> = {
  "pains.cards": "Pains",
  "services.menu-from-prices": "Services",
  "services.process-insurance": "Process",
  "trust.reviews-certs": "Reviews",
  "trust.before-after": "Gallery",
  "convert.quote-booking": "Quote",
};

function vars(site: Site): CSSProperties {
  return {
    "--primary": site.theme.palette.primary,
    "--on-primary": site.theme.palette.onPrimary,
    "--surface": site.theme.palette.surface,
    "--text": site.theme.palette.text,
    "--type-scale": String(site.theme.typeScale),
  } as CSSProperties;
}

function links(site: Site) {
  if (site.pages.length > 1) {
    return site.pages.map((page) => ({ key: page.id, href: page.slug || "/", label: tx(site, page.title) }));
  }
  return (site.pages[0]?.sections ?? []).flatMap((section) => {
    const label = NAV[section.recipe];
    return label ? [{ key: section.id, href: `#${section.id}`, label }] : [];
  });
}

function contactFrom(site: Site) {
  const hero = site.pages[0]?.sections.find((section) => section.recipe === "hero.split-photo");
  const cta = hero?.fields.primaryCta;
  if (!cta || typeof cta !== "object") return null;
  const record = cta as { label?: Record<string, string>; action?: Action };
  if (!record.label || !record.action) return null;
  return record;
}

export function SitePage({ site }: { site: Site }) {
  const page = site.pages[0];
  if (!page) return null;
  const contact = contactFrom(site);
  return (
    <article
      className="site"
      id="top"
      data-radius={site.theme.radius}
      data-heading={site.theme.fonts.heading}
      data-body={site.theme.fonts.body}
      data-sticky={site.theme.stickyHeader ? "true" : "false"}
      style={vars(site)}
    >
      <header className="topnav">
        <a className="wordmark" href="#top">{site.business.name}</a>
        <nav>
          {links(site).map((item) => <a key={item.key} href={item.href}>{item.label}</a>)}
        </nav>
        {contact?.action ? <a className="btn btn-fill" href={actionHref(liveAction(site, contact.action))}>{tx(site, contact.label ?? {})}</a> : null}
      </header>
      {page.sections.map((section) => <Recipe key={section.id} site={site} section={section} />)}
      <StickyBar site={site} />
    </article>
  );
}
