import { Band, type Block } from "../parts";
import { line } from "./text";

export function Offer({ site, section }: Block) {
  return (
    <Band id={section.id} group={section.group} label="Offer" variant={section.variant} icon="ads_click" className="block offer" wrap="wrap offer-banner card glass" style={section.style}>
      <span className="chip">Sample</span>
      <h2>{line(site, section.fields.headline)}</h2>
      <p>{line(site, section.fields.subhead)}</p>
    </Band>
  );
}
