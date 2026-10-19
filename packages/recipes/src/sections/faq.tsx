import { actionHref, Band, liveAction, pageHref, type Block } from "../parts";
import { line, rows } from "./text";

export function Faq({ site, section }: Block) {
  const items = rows(section.fields.items);
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }));
  return (
    <Band id={section.id} group={section.group} label="FAQ" variant={section.variant} icon="description" className="block faq" wrap="wrap faq-split" style={section.style}>
      <div>
        <h2>{line(site, section.fields.headline)}</h2>
        <p className="lede">{line(site, section.fields.subhead)}</p>
        <div className="cta-row">
          <a className="btn btn-line" href={call}>Call</a>
          <a className="btn btn-fill" href={pageHref("estimate", "file")}>Get an estimate</a>
        </div>
      </div>
      <div className="accordion">
        {items.map((item) => (
          <details key={line(site, item.q)} className="card glass">
            <summary>{line(site, item.q)}</summary>
            <p>{line(site, item.a)}</p>
          </details>
        ))}
      </div>
    </Band>
  );
}
