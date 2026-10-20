import type { Site } from "@pandino/schema";
import { BusinessInfo } from "./business";
import { SectionLook, StyleFields, type ThemePatch } from "./design";
import { TextFields } from "./fields";
import { GROUPS, recipeLabel, type RailId } from "./groups";
import { Icon } from "./chrome";
import { PageList } from "./pages";

type Fields = Site["pages"][number]["sections"][number]["fields"];

type Style = Site["pages"][number]["sections"][number]["style"];

export function Panel({ site, group, slug, note, hot, onFields, onBrand, onStyle, onTheme, onBusiness, onTitle, onSave, onPage, onSection, onOrder }: {
  site: Site;
  group: RailId;
  slug: string;
  note: string;
  hot: string;
  onFields: (id: string, fields: Fields) => void;
  onBrand: (color: string) => void;
  onStyle: (id: string, style: Style) => void;
  onTheme: (patch: ThemePatch) => void;
  onBusiness: (business: Site["business"]) => void;
  onTitle: (title: string) => void;
  onSave: () => void;
  onPage: (slug: string) => void;
  onSection: (id: string, group: string) => void;
  onOrder: (from: number, to: number) => void;
}) {
  const meta = GROUPS.find((item) => item.id === group) ?? GROUPS[0];
  return (
    <aside className="panel" aria-label={meta.title}>
      <header className="panel-head">
        <div className="ph-title"><Icon name={meta.icon} /><h1>{meta.title}</h1></div>
      </header>
      <div className="panel-body">
        {group === "pages" ? <PageList site={site} slug={slug} hot={hot} onPage={onPage} onSection={onSection} onFields={onFields} onOrder={onOrder} /> : null}
        {group === "pages" ? <BusinessInfo site={site} onBusiness={onBusiness} onTitle={onTitle} /> : null}
        {group === "style" ? <StyleFields site={site} onBrand={onBrand} onTheme={onTheme} /> : null}
        {group !== "pages" && group !== "style" ? <Sections site={site} slug={slug} group={group} hot={hot} onFields={onFields} onStyle={onStyle} /> : null}
      </div>
      <footer className="panel-foot">
        <button type="button" className="save-btn" onClick={onSave}><Icon name="save" fill />Save</button>
        <span className="save-note" role="status">{note}</span>
      </footer>
    </aside>
  );
}

function Sections({ site, slug, group, hot, onFields, onStyle }: {
  site: Site;
  slug: string;
  group: RailId;
  hot: string;
  onFields: (id: string, fields: Fields) => void;
  onStyle: (id: string, style: Style) => void;
}) {
  const sections = (site.pages.find((page) => page.slug === slug)?.sections ?? []).filter((section) => section.group === group);
  if (!sections.length) return <p className="hint">This page has no {group} section.</p>;
  return sections.map((section) => (
    <section className={section.id === hot ? "grp on" : "grp"} key={section.id}>
      <div className="grp-h"><h3>{recipeLabel(section.recipe)}</h3></div>
      <SectionLook style={section.style} onStyle={(style) => onStyle(section.id, style)} />
      <TextFields value={section.fields} locale={site.locales.default} onChange={(fields) => onFields(section.id, fields as Fields)} />
    </section>
  ));
}
