import type { Site } from "@pandino/schema";
import { TextFields } from "./fields";

type Fields = Site["pages"][number]["sections"][number]["fields"];
type Section = Site["pages"][number]["sections"][number];

export function PageList({ site, slug, hot, onPage, onSection, onFields }: {
  site: Site;
  slug: string;
  hot: string;
  onPage: (slug: string) => void;
  onSection: (id: string, group: string) => void;
  onFields: (id: string, fields: Fields) => void;
}) {
  const page = site.pages.find((item) => item.slug === slug) ?? site.pages[0];
  if (!page) return null;
  const locale = site.locales.default;
  const current = page.sections.find((section) => section.id === hot);
  return (
    <div className="stack">
      <ul className="page-list">
        {site.pages.map((item) => (
          <li key={item.id}>
            <button type="button" className={item.slug === page.slug ? "on" : ""} onClick={() => onPage(item.slug)}>
              {item.title[locale] ?? item.slug}
            </button>
          </li>
        ))}
      </ul>
      <div className="section-pills">
        {page.sections.map((section) => (
          <button key={section.id} type="button" className={section.id === hot ? "on" : ""} onClick={() => onSection(section.id, section.group)}>
            {sectionName(section, locale)}
          </button>
        ))}
      </div>
      {current ? <TextFields value={current.fields} locale={locale} onChange={(fields) => onFields(current.id, fields as Fields)} /> : null}
    </div>
  );
}

function sectionName(section: Section, locale: string) {
  const headline = section.fields.headline as Record<string, string> | undefined;
  return headline?.[locale] ?? section.recipe;
}
