import { GoogleBadge } from "./facts";
import { recipeFields } from "./fields";
import { anyPhoto, Mark, photo } from "./media";
import { Band, Cta, readFields, tx, type Block } from "./parts";

const PAIN_ICONS = ["description", "schedule", "format_paint"];
const MENU_ICONS = ["car_repair", "format_paint", "minor_crash", "directions_car"];

export function Hero({ site, section }: Block) {
  const fields = readFields(recipeFields["hero.split-photo"], section.fields);
  if (!fields) return null;
  const shot = photo(site, fields.image.assetId);
  return (
    <Band id={section.id} group={section.group} label="Hero" icon="minor_crash" className="hero block hero-screen" wrap="wrap hero-copy" style={section.style} image={shot?.src}>
      <p className="eyebrow"><Mark name="minor_crash" />{tx(site, fields.eyebrow)}</p>
      <GoogleBadge site={site} />
      <h1 className="display">{tx(site, fields.headline)}</h1>
      <p className="lede">{tx(site, fields.subhead)}</p>
      <div className="cta-row">
        <Cta site={site} label={fields.primaryCta.label} action={fields.primaryCta.action} className="btn btn-fill" />
        <Cta site={site} label={fields.secondaryCta.label} action={fields.secondaryCta.action} className="btn btn-line" />
      </div>
      {shot ? <span className="sr">{tx(site, shot.alt)}</span> : <p className="note">Add a photo of your shop</p>}
    </Band>
  );
}

export function Pains({ site, section }: Block) {
  const fields = readFields(recipeFields["pains.cards"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label="Pains" className="block band strip" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="sentiment_dissatisfied" style={section.style} image={anyPhoto(site)}>
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
    <Band id={section.id} group={section.group} label={fields.items.length === 1 ? tx(site, fields.items[0]?.name ?? {}) || "Services" : "Services"} className="block" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="construction" style={section.style} image={anyPhoto(site)}>
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
