import type { Site } from "@pandino/schema";
import { pageHref } from "./href";

type Page = Site["pages"][number];
const SHORT: Record<string, string> = { "Process & Warranty": "Repairs", "Gallery & Reviews": "Gallery", "About & Contact": "Contact" };

export function menuName(page: Page, locale: string) {
  const title = page.title[locale] ?? "";
  return page.menu ?? SHORT[title] ?? page.title[locale] ?? page.slug;
}

export function SiteMenu({ site, links, slug }: { site: Site; links: "file" | "pretty"; slug: string }) {
  const locale = site.locales.default;
  const pages = site.pages.filter((page) => page.nav || page.parent);
  const name = (page: Page) => menuName(page, locale);
  const top = pages.filter((page) => !page.parent || !pages.some((item) => item.slug === page.parent && !item.parent));
  const nested = pages.some((page) => page.slug === slug && page.parent);
  const list = (className: string) => <ul className={className} aria-label="Main Navigation">{top.map((page) => <Item key={page.id} page={page} pages={pages} slug={slug} links={links} name={name} />)}</ul>;
  return (
    <>
      <details className="hdr-fold" open={nested || undefined}><summary>Menu</summary>{list("menu menu-vertical")}</details>
      {list("menu menu-horizontal")}
    </>
  );
}

function Item({ page, pages, slug, links, name }: { page: Page; pages: Page[]; slug: string; links: "file" | "pretty"; name: (page: Page) => string }) {
  const kids = pages.filter((item) => item.parent === page.slug);
  const current = page.slug === slug ? "page" : undefined;
  if (!kids.length) return <li><a className={current ? "menu-active" : undefined} aria-current={current} href={pageHref(page.slug, links)}>{name(page)}</a></li>;
  const shown = Boolean(current || kids.some((kid) => kid.slug === slug));
  return (
    <li>
      <details open={shown || undefined}>
        <summary className={shown ? "menu-active" : undefined}>{name(page)}</summary>
        <ul>
          <li><a className={current ? "menu-active" : undefined} aria-current={current} href={pageHref(page.slug, links)}>{name(page)}</a></li>
          {kids.map((kid) => <li key={kid.id}><a className={kid.slug === slug ? "menu-active" : undefined} aria-current={kid.slug === slug ? "page" : undefined} href={pageHref(kid.slug, links)}>{name(kid)}</a></li>)}
        </ul>
      </details>
    </li>
  );
}
