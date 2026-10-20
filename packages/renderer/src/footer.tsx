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
    <footer id="footer" className="w-full bg-[#070A10] border-t border-white/[0.08] text-slate-300 antialiased" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-[13px]">
        <div className="space-y-3">
          <div className="flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-primary text-primary-content flex items-center justify-center font-black text-xs">{site.business.name.trim().charAt(0) || "P"}</span><span className="brand-wordmark text-base font-bold text-white">{site.business.name}</span></div>
          <p className="text-slate-400 text-[12px] leading-relaxed">{blurb(site)}</p>
          <p className="text-slate-400 text-[12px] leading-relaxed">{placeLine(site)}</p>
          <p className="text-slate-400 text-[12px] leading-relaxed">{phoneLabel(site)}</p>
          <p className="text-slate-400 text-[12px] leading-relaxed">{site.business.hours.trim() || "Add your opening hours"}</p>
          {site.business.market === "IT" ? <p className="text-[11px] font-mono text-slate-500">{vatLine(site)}</p> : null}
        </div>
        <LinkList title="Services" items={serviceLinks(site, links)} />
        <LinkList title="Pages" items={nav} />
        <LinkList title="Legal" items={legal} />
      </div>
      <div className="foot-bar border-t border-white/[0.06] py-4 text-[11px] text-slate-500" data-sticky="false">
        <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {site.business.name}</p>
          <ul className="flex flex-wrap items-center gap-5 list-none p-0 m-0">{legal.map((item) => <li key={item.href}><a className="hover:text-slate-400" href={item.href}>{item.label}</a></li>)}</ul>
          <Socials site={site} />
        </div>
      </div>
    </footer>
  );
}

function LinkList({ title, items }: { title: string; items: Link[] }) {
  return (
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{title}</h2>
      <ul className="space-y-1.5 list-none p-0 m-0">{items.map((item) => <li key={`${item.href}:${item.label}`}><a className="hover:text-white" href={item.href}>{item.label}</a></li>)}</ul>
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
