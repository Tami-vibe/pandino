import { photo, Shot } from "../media";
import { Band, tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Feature({ site, section }: Block) {
  const specs = rows(section.fields.specs);
  const image = photo(site, "ast_shop") ?? photo(site, "ast_after");
  return (
    <Band id={section.id} group={section.group} label="Feature" variant={section.variant} icon="construction" className="block feature" wrap="wrap feature-split" style={section.style}>
      <Shot label="Sample facility photo. Not this shop." src={image?.src} alt={image ? tx(site, image.alt) : undefined} />
      <div>
        <h2>{line(site, section.fields.headline)}</h2>
        <p className="lede">{line(site, section.fields.subhead)}</p>
        <dl className="specs">
          {specs.map((spec) => (
            <div key={line(site, spec.label)}>
              <dt>{line(site, spec.label)}</dt>
              <dd>{line(site, spec.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Band>
  );
}
