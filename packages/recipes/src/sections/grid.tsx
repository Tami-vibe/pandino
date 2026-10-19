import { recipeFields } from "../fields";
import { pageHref } from "../href";
import { Mark } from "../media";
import { Band, readFields, tx, type Block } from "../parts";

const ICONS = ["car_repair", "format_paint", "minor_crash", "directions_car", "construction", "search"];

export function ServiceGrid({ site, section }: Block) {
  const fields = readFields(recipeFields["services.menu-from-prices"], section.fields);
  if (!fields) return null;
  const href = pageHref("services", "file");
  return (
    <Band id={section.id} group={section.group} label="Services" variant={section.variant} icon="construction" className="block" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} style={section.style}>
      <div className="svc-grid">
        {fields.items.map((item, index) => (
          <article key={tx(site, item.name)} className="card glass svc">
            <Mark name={ICONS[index] ?? "car_repair"} />
            <h3>{tx(site, item.name)}</h3>
            <p>{tx(site, item.detail)}</p>
            <a href={href}>Learn more</a>
          </article>
        ))}
        <a className="card svc more" href={href}>Explore all services</a>
      </div>
    </Band>
  );
}
