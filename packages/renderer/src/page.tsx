import type { CSSProperties } from "react";
import type { Site } from "@pandino/schema";
import { Recipe, StickyBar } from "@pandino/recipes";
import { rampVars } from "@pandino/theme";
import { SiteFooter } from "./footer";
import { CookieBar, SiteHeader } from "./header";

function vars(site: Site): CSSProperties {
  const brand = site.theme.brandColor;
  return { "--primary": brand, "--on-primary": site.theme.palette.onPrimary, "--radius-selector": "0.5rem", ...rampVars(brand) } as CSSProperties;
}

export function SitePage({ site, slug, links = "file" }: { site: Site; slug?: string; links?: "file" | "pretty" }) {
  const page = site.pages.find((item) => item.slug === slug) ?? site.pages[0];
  if (!page) return null;
  return (
      <article
        className="site kit"
        id="top"
        data-theme="dark"
        data-radius={site.theme.radius}
        data-heading={site.theme.fonts.heading}
        data-body={site.theme.fonts.body}
        data-sticky={site.theme.stickyHeader ? "true" : "false"}
        style={vars(site)}
      >
        <SiteHeader site={site} links={links} />
        <main className="heroes-container w-full bg-base-100">
          {page.sections.map((section) => <Recipe key={section.id} site={site} section={section} />)}
          <SiteFooter site={site} links={links} />
        </main>
        {site.business.market === "IT" ? <CookieBar /> : null}
        <StickyBar site={site} />
      </article>
  );
}
