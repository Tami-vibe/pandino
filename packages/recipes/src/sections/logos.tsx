import { Band, type Block } from "../parts";
import { line, rows } from "./text";

export function Logos({ site, section }: Block) {
  const brands = rows(section.fields.brands);
  return (
    <Band id={section.id} group={section.group} label="Brands" variant={section.variant} icon="directions_car" className="block logos" wrap="wrap" style={section.style}>
      <p className="eyebrow">{line(site, section.fields.headline)}</p>
      <ul className="brand-row">
        {brands.map((brand) => <li key={line(site, brand)}>{line(site, brand)}</li>)}
      </ul>
    </Band>
  );
}
