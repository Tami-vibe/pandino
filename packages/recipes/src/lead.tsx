import { recipeFields } from "./fields";
import { anyPhoto, Mark } from "./media";
import { Band, readFields, tx, type Block } from "./parts";

const PAIN_ICONS = ["description", "schedule", "format_paint"];
const MENU_ICONS = ["car_repair", "format_paint", "minor_crash", "directions_car"];

export function Pains({ site, section }: Block) {
  const fields = readFields(recipeFields["pains.cards"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label="Pains" variant={section.variant} className="block band strip" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="sentiment_dissatisfied" style={section.style} image={anyPhoto(site)}>
      <div className="cards">
        {fields.items.map((item, index) => (
          <article key={tx(site, item.title)} className="card icon-card">
            <Mark name={PAIN_ICONS[index] ?? "search"} />
            <h3>{tx(site, item.title)}</h3>
            <p>{tx(site, item.body)}</p>
          </article>
        ))}
      </div>
    </Band>
  );
}

export function Menu({ site, section }: Block) {
  const fields = readFields(recipeFields["services.menu-from-prices"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label={fields.items.length === 1 ? tx(site, fields.items[0]?.name ?? {}) || "Services" : "Services"} variant={section.variant} className="block" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="construction" style={section.style} image={anyPhoto(site)}>
      <ul className="menu">
        {fields.items.map((item, index) => (
          <li key={tx(site, item.name)}>
            <Mark name={MENU_ICONS[index] ?? "car_repair"} />
            <div>
              <h3>{tx(site, item.name)}</h3>
              <p>{tx(site, item.detail)}</p>
            </div>
            <p className="price">
              <strong>{tx(site, item.priceLabel)}</strong>
              <span>{tx(site, item.duration)}</span>
              <span>Replace with your price</span>
            </p>
          </li>
        ))}
      </ul>
    </Band>
  );
}
