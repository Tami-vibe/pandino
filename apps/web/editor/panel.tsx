import { useEffect, useState } from "react";
import type { Site } from "@pandino/schema";
import { BusinessInfo } from "./business";
import { TextFields } from "./fields";
import { GROUPS, recipeLabel, type RailId } from "./groups";
import { Icon } from "./chrome";

type Fields = Site["pages"][number]["sections"][number]["fields"];

export function Panel({ site, group, note, onFields, onBrand, onBusiness, onTitle, onSave }: {
  site: Site;
  group: RailId;
  note: string;
  onFields: (id: string, fields: Fields) => void;
  onBrand: (color: string) => void;
  onBusiness: (business: Site["business"]) => void;
  onTitle: (title: string) => void;
  onSave: () => void;
}) {
  const meta = GROUPS.find((item) => item.id === group) ?? GROUPS[0];
  return (
    <aside className="panel" aria-label={meta.title}>
      <header className="panel-head">
        <div className="ph-title"><Icon name={meta.icon} /><h1>{meta.title}</h1></div>
      </header>
      <div className="panel-body">
        {group === "pages" ? <BusinessInfo site={site} onBusiness={onBusiness} onTitle={onTitle} /> : null}
        {group === "style" ? <Style site={site} onBrand={onBrand} /> : null}
        {group !== "pages" && group !== "style" ? <Sections site={site} group={group} onFields={onFields} /> : null}
      </div>
      <footer className="panel-foot">
        <button type="button" className="save-btn" onClick={onSave}><Icon name="save" fill />Save</button>
        <span className="save-note" role="status">{note}</span>
      </footer>
    </aside>
  );
}

function Style({ site, onBrand }: { site: Site; onBrand: (color: string) => void }) {
  const [hex, setHex] = useState(site.theme.brandColor);
  useEffect(() => { setHex(site.theme.brandColor); }, [site.theme.brandColor]);
  function apply(value: string) {
    const next = value.toUpperCase();
    setHex(next);
    if (/^#[0-9A-Fa-f]{6}$/.test(next)) onBrand(next);
  }
  return (
    <div className="stack">
      <label className="edit">
        <span>Brand color</span>
        <span className="color-row">
          <input type="color" aria-label="Brand color" value={/^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : site.theme.brandColor} onChange={(event) => apply(event.target.value)} />
          <input className="studio-input" aria-label="Brand color hex" value={hex} onChange={(event) => apply(event.target.value)} />
        </span>
      </label>
      <p className="hint">{site.theme.fonts.heading} and {site.theme.fonts.body}</p>
    </div>
  );
}

function Sections({ site, group, onFields }: { site: Site; group: RailId; onFields: (id: string, fields: Fields) => void }) {
  const sections = site.pages[0]?.sections.filter((section) => section.group === group) ?? [];
  if (!sections.length) return <p className="hint">This page has no {group} section.</p>;
  return sections.map((section) => (
    <section className="grp" key={section.id}>
      <div className="grp-h"><h3>{recipeLabel(section.recipe)}</h3></div>
      <TextFields value={section.fields} locale={site.locales.default} onChange={(fields) => onFields(section.id, fields as Fields)} />
    </section>
  ));
}
