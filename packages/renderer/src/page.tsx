import type { CSSProperties } from "react";
import type { Site } from "@pandino/schema";
import { LinkMode, Recipe, StickyBar } from "@pandino/recipes";
import { SiteFooter } from "./footer";
import { CookieBar, SiteHeader } from "./header";

function vars(site: Site): CSSProperties {
  return {
    "--primary": site.theme.palette.primary,
    "--on-primary": site.theme.palette.onPrimary,
    "--surface": site.theme.palette.surface,
    "--text": site.theme.palette.text,
    "--type-scale": String(site.theme.typeScale),
  } as CSSProperties;
}

export function SitePage({ site, slug, links = "file" }: { site: Site; slug?: string; links?: "file" | "pretty" }) {
  const page = site.pages.find((item) => item.slug === slug) ?? site.pages[0];
  if (!page) return null;
  return (
    <LinkMode.Provider value={links}>
      <article
        className="site"
        id="top"
        data-radius={site.theme.radius}
        data-heading={site.theme.fonts.heading}
        data-body={site.theme.fonts.body}
        data-sticky={site.theme.stickyHeader ? "true" : "false"}
        style={vars(site)}
      >
        <SiteHeader site={site} links={links} />
        {page.sections.map((section) => <Recipe key={section.id} site={site} section={section} />)}
        <SiteFooter site={site} links={links} />
        {site.business.market === "IT" ? <CookieBar /> : null}
        <StickyBar site={site} />
      </article>
    </LinkMode.Provider>
  );
}
