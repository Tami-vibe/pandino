import { photo, Shot } from "../media";
import { Band, tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Facility({ site, section }: Block) {
  const filters = rows(section.fields.filters);
  return (
    <Band id={section.id} group={section.group} label="Facility" variant={section.variant} icon="photo_camera" className="block" wrap="wrap" title={line(site, section.fields.headline)} body={line(site, section.fields.subhead)} style={section.style}>
      <div className="filters">
        <div className="chip-row">
          {filters.map((item, index) => (
            <label key={line(site, item.name)} className="chip">
              <input className="pick" type="radio" name={section.id} defaultChecked={index === 0} />
              {line(site, item.name)}
            </label>
          ))}
        </div>
        <div className="filter-stage">
          {filters.map((item) => {
            const image = photo(site, String(item.assetId ?? ""));
            return <Shot key={String(item.assetId)} label="Sample photo. Not this shop." src={image?.src} alt={image ? tx(site, image.alt) : undefined} />;
          })}
        </div>
      </div>
    </Band>
  );
}
