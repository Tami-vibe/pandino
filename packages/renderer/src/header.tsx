import type { Site } from "@pandino/schema";
import { actionHref, liveAction, pageHref, SiteMenu } from "@pandino/recipes";

type Mode = "file" | "pretty";

export function SiteHeader({ site, links, slug = "/" }: { site: Site; links: Mode; slug?: string }) {
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }), site, links);
  const mark = site.business.name.trim().charAt(0) || "P";
  return (
    <header id="header" className="site-header sticky top-0 z-50 w-full h-14 bg-base-100/80 backdrop-blur-xl border-b border-white/[0.08] transition-all" data-header={site.theme.chrome.header} data-tone={site.theme.chrome.tone} data-ctas={site.theme.chrome.ctas} data-cta-place={site.theme.chrome.place} data-theme="dark" style={{ ["--hdr-size" as string]: `${site.theme.chrome.size}px` }}>
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
        <div className="hdr-group">
          <a href={pageHref("/", links)} className="flex items-center gap-2.5 text-lg font-bold text-base-content no-underline">
            <span className="w-8 h-8 rounded-xl bg-primary text-primary-content flex items-center justify-center text-sm font-extrabold shadow-sm">{mark}</span>
            <span className="brand-name font-bold tracking-tight">{site.business.name}</span>
          </a>
          <SiteMenu site={site} links={links} slug={slug} />
        </div>
        <div className="hdr-actions flex items-center gap-3">
          <a className="hdr-call btn btn-sm h-9 px-4 rounded-full bg-white/10 text-white border border-white/10" href={call}>Call</a>
          <a className="hdr-est btn btn-sm h-9 px-4 rounded-full btn-primary text-xs font-semibold shadow-none border-none" href={pageHref("estimate", links)}>Get an estimate</a>
        </div>
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
