import type { Site } from "@pandino/schema";
import { Icon } from "./chrome";
import { TextFields } from "./fields";
import { sectionIcon } from "./groups";

type Fields = Site["pages"][number]["sections"][number]["fields"];
type Section = Site["pages"][number]["sections"][number];
type Page = Site["pages"][number];

export function PageList({ site, slug, hot, onPage, onSection, onFields, onOrder }: {
  site: Site;
  slug: string;
  hot: string;
  onPage: (slug: string) => void;
  onSection: (id: string, group: string) => void;
  onFields: (id: string, fields: Fields) => void;
  onOrder: (from: number, to: number) => void;
}) {
  const page = site.pages.find((item) => item.slug === slug) ?? site.pages[0];
  if (!page) return null;
  const locale = site.locales.default;
  const current = page.sections.find((section) => section.id === hot);
  const menu = site.pages.filter((item) => item.nav);
  const rest = site.pages.filter((item) => !item.nav);
  return (
    <div className="edits">
      <ul className="menu menu-sm rounded-box w-full page-menu" data-theme="dark">
        <li className="menu-title">On the menu</li>
        {menu.map((item) => <PageRow key={item.id} item={item} on={item.slug === page.slug} locale={locale} onPage={onPage} />)}
        <li className="menu-title">Other pages</li>
        {rest.map((item) => <PageRow key={item.id} item={item} on={item.slug === page.slug} locale={locale} onPage={onPage} />)}
      </ul>
      <ul className="menu menu-sm rounded-box w-full section-menu" data-theme="dark">
        {page.sections.map((section, index) => (
          <SectionRow key={section.id} section={section} locale={locale} on={section.id === hot} index={index} onSection={onSection} onOrder={onOrder} />
        ))}
      </ul>
      {current ? <TextFields value={current.fields} locale={locale} onChange={(fields) => onFields(current.id, fields as Fields)} /> : null}
    </div>
  );
}

function PageRow({ item, on, locale, onPage }: { item: Page; on: boolean; locale: string; onPage: (slug: string) => void }) {
  return (
    <li>
      <button type="button" className={on ? "active" : ""} onClick={() => onPage(item.slug)}>
        <Icon name="description" />
        {item.title[locale] ?? item.slug}
      </button>
    </li>
  );
}

function SectionRow({ section, locale, on, index, onSection, onOrder }: {
  section: Section;
  locale: string;
  on: boolean;
  index: number;
  onSection: (id: string, group: string) => void;
  onOrder: (from: number, to: number) => void;
}) {
  return (
    <li
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => dropRow(event, index, onOrder)}
    >
      <button type="button" className={on ? "active" : ""} onClick={() => onSection(section.id, section.group)}>
        <span className="grip" aria-hidden="true" />
        <Icon name={sectionIcon(section.recipe)} />
        <span>{(section.fields.headline as Record<string, string> | undefined)?.[locale] ?? section.recipe}</span>
      </button>
    </li>
  );
}

function dropRow(event: { preventDefault: () => void; dataTransfer: { getData: (type: string) => string } }, index: number, onOrder: (from: number, to: number) => void) {
  event.preventDefault();
  const from = Number(event.dataTransfer.getData("text/plain"));
  if (Number.isInteger(from) && from !== index) onOrder(from, index);
}
