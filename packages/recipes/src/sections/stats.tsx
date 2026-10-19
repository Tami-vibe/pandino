import { Band, type Block } from "../parts";
import { line, rows } from "./text";

export function Stats({ site, section }: Block) {
  const items = rows(section.fields.items);
  const badges = rows(section.fields.badges);
  return (
    <Band id={section.id} group={section.group} label="Stats" variant={section.variant} icon="verified" className="block stats" wrap="wrap" title={line(site, section.fields.headline)} body={line(site, section.fields.subhead)} style={section.style}>
      <div className="stat-row">
        {items.map((item) => (
          <article key={line(site, item.label)} className="card glass stat">
            <strong>{line(site, item.value)}</strong>
            <span>{line(site, item.label)}</span>
          </article>
        ))}
      </div>
      <ul className="badge-row">
        {badges.map((badge) => <li key={line(site, badge)} className="chip">{line(site, badge)}</li>)}
      </ul>
    </Band>
  );
}
