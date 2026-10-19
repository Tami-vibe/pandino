import { recipeFields } from "./fields";
import { Band, Cta, Frame, readFields, tx, type Block } from "./parts";

export function Hero({ site, section }: Block) {
  const fields = readFields(recipeFields["hero.split-photo"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="hero block" wrap="wrap hero-grid">
      <div>
        <p className="eyebrow">{tx(site, fields.eyebrow)}</p>
        <h1 className="display">{tx(site, fields.headline)}</h1>
        <p className="lede">{tx(site, fields.subhead)}</p>
        <div className="cta-row">
          <Cta site={site} label={fields.primaryCta.label} action={fields.primaryCta.action} className="btn btn-fill" />
          <Cta site={site} label={fields.secondaryCta.label} action={fields.secondaryCta.action} className="btn btn-line" />
        </div>
      </div>
      <Frame label="Add a photo of your shop" />
    </Band>
  );
}

export function Pains({ site, section }: Block) {
  const fields = readFields(recipeFields["pains.cards"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block band" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <div className="cards">
        {fields.items.map((item) => (
          <article key={tx(site, item.title)} className="card">
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
    <Band id={section.id} className="block" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <ul className="menu">
        {fields.items.map((item) => (
          <li key={tx(site, item.name)}>
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

export function Process({ site, section }: Block) {
  const fields = readFields(recipeFields["services.process-insurance"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block band" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <ol className="steps">
        {fields.steps.map((step, index) => (
          <li key={tx(site, step.title)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{tx(site, step.title)}</h3>
            <p>{tx(site, step.body)}</p>
          </li>
        ))}
      </ol>
      <p className="note">{tx(site, fields.note)}</p>
    </Band>
  );
}
