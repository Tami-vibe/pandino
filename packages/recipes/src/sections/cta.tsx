import { actionHref, Band, liveAction, pageHref, type Block } from "../parts";
import { line } from "./text";

export function CtaBand({ site, section }: Block) {
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }));
  return (
    <Band id={section.id} group={section.group} label="Call to action" variant={section.variant} icon="call" className="block cta-band" wrap="wrap" style={section.style}>
      <h2>{line(site, section.fields.headline)}</h2>
      <p className="lede">{line(site, section.fields.subhead)}</p>
      <div className="cta-row">
        <a className="btn btn-fill" href={call}>Call</a>
        <a className="btn btn-line" href={pageHref("estimate", "file")}>Get an estimate</a>
      </div>
    </Band>
  );
}
