import type { CSSProperties } from "react";
import type { Site } from "@pandino/schema";
import { Recipe, StickyBar, actionHref, liveAction, tx } from "@pandino/recipes";
import type { Action } from "@pandino/recipes/fields";

const LINKS = [
  ["services.menu-from-prices", "Services"],
  ["services.process-insurance", "Process"],
  ["trust.reviews-certs", "Reviews"],
  ["convert.quote-booking", "Quote"],
] as const;

function vars(site: Site): CSSProperties {
  return {
    "--primary": site.theme.palette.primary,
    "--on-primary": site.theme.palette.onPrimary,
    "--surface": site.theme.palette.surface,
    "--text": site.theme.palette.text,
  } as CSSProperties;
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
      style={vars(site)}
    >
      <header className="topnav">
        <a className="wordmark" href="#top">{site.business.name}</a>
        <nav>
          {LINKS.map(([recipe, label]) => {
            const section = page.sections.find((item) => item.recipe === recipe);
            return section ? <a key={recipe} href={`#${section.id}`}>{label}</a> : null;
          })}
        </nav>
        {contact?.action ? <a className="btn btn-fill" href={actionHref(liveAction(site, contact.action))}>{tx(site, contact.label ?? {})}</a> : null}
      </header>
      {page.sections.map((section) => <Recipe key={section.id} site={site} section={section} />)}
      <StickyBar site={site} />
    </article>
  );
}
