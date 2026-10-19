import type { Site } from "@pandino/schema";
import { actionHref, liveAction, pageHref } from "@pandino/recipes";

type Mode = "file" | "pretty";

export function SiteHeader({ site, links }: { site: Site; links: Mode }) {
  const locale = site.locales.default;
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }), site, links);
  return (
    <header className="topnav">
      <a className="wordmark" href={pageHref("/", links)}>{site.business.name}</a>
      <nav>
        {site.pages.filter((page) => page.nav).map((page) => (
          <a key={page.id} href={pageHref(page.slug, links)}>{page.title[locale] ?? page.slug}</a>
        ))}
      </nav>
      <div className="nav-cta">
        <a className="btn btn-line" href={call}>Call</a>
        <a className="btn btn-fill" href={pageHref("estimate", links)}>Get an estimate</a>
      </div>
    </header>
  );
}

export function CookieBar() {
  return (
    <aside className="cookie-bar" role="dialog" aria-label="Cookie consent">
      <p>This template sets no non-essential cookies before you choose. Accept and reject are equal. Scrolling is not consent. Not legal advice.</p>
      <div className="cookie-actions">
        <button type="button" data-cookie-choice="reject">Reject</button>
        <button type="button" data-cookie-choice="accept">Accept</button>
      </div>
    </aside>
  );
}
