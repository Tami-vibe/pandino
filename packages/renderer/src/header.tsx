import type { Site } from "@pandino/schema";
import { actionHref, liveAction, pageHref } from "@pandino/recipes";

type Mode = "file" | "pretty";

export function SiteHeader({ site, links }: { site: Site; links: Mode }) {
  const locale = site.locales.default;
  const italian = site.business.market === "IT";
  const call = italian
    ? { type: "whatsapp" as const, value: site.business.whatsapp || site.business.phone, label: "WhatsApp" }
    : { type: "tel" as const, value: site.business.phone, label: "Call" };
  return (
    <header className="topnav">
      <a className="wordmark" href={pageHref("/", links)}>{site.business.name}</a>
      <nav>
        {site.pages.filter((page) => page.nav).map((page) => (
          <a key={page.id} href={pageHref(page.slug, links)}>{page.title[locale] ?? page.slug}</a>
        ))}
      </nav>
      <div className="nav-cta">
        <a className="btn btn-fill" href={pageHref("estimate", links)}>Get an estimate</a>
        <a className="btn btn-line" href={actionHref(liveAction(site, call), site, links)}>{call.label}</a>
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
