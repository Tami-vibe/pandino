import type { Site } from "@pandino/schema";
import { BusinessInfo } from "./business";
import { SectionLook, StyleFields } from "./design";
import { TextFields } from "./fields";
import { HeroDock } from "./hero-dock";
import { GROUPS, recipeLabel, type RailId } from "./groups";
import { Icon } from "./chrome";
import { PageList } from "./pages";

type Fields = Site["pages"][number]["sections"][number]["fields"];

type Style = Site["pages"][number]["sections"][number]["style"];

export function Panel({ site, group, slug, note, hot, onFields, onBrand, onStyle, onTheme, onSite, onBusiness, onSave, onPage, onSection, onPending }: {
  site: Site;
  group: RailId;
  slug: string;
  note: string;
  hot: string;
  onFields: (id: string, fields: Fields) => void;
  onBrand: (color: string) => void;
  onStyle: (id: string, style: Style) => void;
  onTheme: (patch: Partial<Site["theme"]>) => void;
  onSite: (next: Site) => void;
  onBusiness: (business: Site["business"]) => void;
  onSave: () => void;
  onPage: (slug: string) => void;
  onSection: (id: string, group: string) => void;
  onPending: (next: Site | null, slug?: string) => void;
}) {
  const meta = GROUPS.find((item) => item.id === group) ?? GROUPS[0];
  return (
    <aside className="panel" aria-label={meta.title}>
      <header className="panel-head">
        <div className="ph-title"><Icon name={meta.icon} /><h1>{meta.title}</h1></div>
      </header>
      <div className="panel-body">
        {group === "pages" ? <PageList site={site} slug={slug} hot={hot} onPage={onPage} onSection={onSection} onFields={onFields} onSite={onSite} onPending={onPending} /> : null}
        {group === "pages" ? <BusinessInfo site={site} onBusiness={onBusiness} /> : null}
        {group === "style" ? <StyleFields site={site} onBrand={onBrand} onTheme={onTheme} /> : null}
        {group !== "pages" && group !== "style" ? <Sections site={site} slug={slug} group={group} hot={hot} onFields={onFields} onStyle={onStyle} onSite={onSite} /> : null}
      </div>
      <footer className="panel-foot">
        <button type="button" className="save-btn" onClick={onSave}><Icon name="save" fill />Save</button>
        <span className="save-note" role="status" data-bad={note === "Could not update the preview." ? "" : undefined}>{note}</span>
      </footer>
    </aside>
  );
}

function Sections({ site, slug, group, hot, onFields, onStyle, onSite }: {
  site: Site;
  slug: string;
  group: RailId;
  hot: string;
  onFields: (id: string, fields: Fields) => void;
  onStyle: (id: string, style: Style) => void;
  onSite: (next: Site) => void;
}) {
  const sections = (site.pages.find((page) => page.slug === slug)?.sections ?? []).filter((section) => section.group === group);
  if (!sections.length) return <p className="hint">This page has no {group} section.</p>;
  return sections.map((section) => (
    <section className={section.id === hot ? "grp on" : "grp"} key={section.id}>
      <div className="grp-h"><h3>{recipeLabel(section.recipe)}</h3></div>
      {section.recipe === "hero.split-photo" ? <HeroDock site={site} section={section} onSite={onSite} onStyle={(style) => onStyle(section.id, style)} onFields={(fields) => onFields(section.id, fields)} /> : <SectionLook style={section.style} onStyle={(style) => onStyle(section.id, style)} />}
      {section.recipe === "hero.split-photo" ? null : <TextFields value={section.fields} locale={site.locales.default} onChange={(fields) => onFields(section.id, fields as Fields)} />}
    </section>
  ));
}
