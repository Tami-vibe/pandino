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
  const list = (className: string, fold = false) => <ul className={className} aria-label="Main Navigation">{top.map((page) => <Item key={page.id} page={page} pages={pages} slug={slug} links={links} name={name} fold={fold} />)}</ul>;
  return (
    <>
      <details className="hdr-fold"><summary>Menu</summary>{list("menu menu-vertical", true)}</details>
      {list("menu menu-horizontal")}
    </>
  );
}

function Item({ page, pages, slug, links, name, fold }: { page: Page; pages: Page[]; slug: string; links: "file" | "pretty"; name: (page: Page) => string; fold: boolean }) {
  const kids = pages.filter((item) => item.parent === page.slug);
  const mark = (item: Page) => item.slug === slug ? "page" as const : undefined;
  const link = (item: Page, on: boolean) => <a className={on ? "menu-active" : undefined} aria-current={mark(item)} href={pageHref(item.slug, links)}>{name(item)}</a>;
  const here = Boolean(mark(page) || kids.some((kid) => kid.slug === slug));
  if (!kids.length) return <li>{link(page, here)}</li>;
  return <li>{link(page, here)}<ul className={fold ? undefined : "menu-drop"}>{kids.map((kid) => <li key={kid.id}>{link(kid, kid.slug === slug)}</li>)}</ul></li>;
}
