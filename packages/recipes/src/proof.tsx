import { recipeFields } from "./fields";
import { Band, Cta, Frame, readFields, tx, type Block } from "./parts";

export function Reviews({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.reviews-certs"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block" wrap="wrap split" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <div>
        {fields.reviews.map((review) => (
          <blockquote key={tx(site, review.quote)} className="card review">
            <span className="chip">Placeholder</span>
            <p>{tx(site, review.quote)}</p>
            <footer>{tx(site, review.author)}</footer>
          </blockquote>
        ))}
      </div>
      <aside className="card certs">
        <h3>Certifications</h3>
        <p>{tx(site, fields.certificationsNote)}</p>
      </aside>
    </Band>
  );
}

export function Gallery({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.before-after"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block band" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <div className="pair">
        <Frame label="Before — add your photo" />
        <Frame label="After — add your photo" />
      </div>
      <p className="note">{tx(site, fields.caption)}</p>
    </Band>
  );
}

export function Quote({ site, section }: Block) {
  const fields = readFields(recipeFields["convert.quote-booking"], section.fields);
  if (!fields) return null;
  return (
    <Band id={fields.formId} className="block" wrap="wrap quote" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <form className="card form">
        <label>Name<input className="field" name="name" autoComplete="name" /></label>
        <label>Phone<input className="field" name="phone" autoComplete="tel" /></label>
        <label>What happened<textarea className="field area" name="message" rows={4} /></label>
        <label>Photos of the damage<input className="field" type="file" accept="image/*" multiple /></label>
        <p className="note">{tx(site, fields.photoNote)}</p>
        <label className="check"><input type="checkbox" name="contact" /> I agree to be contacted about this quote.</label>
        <label className="check"><input type="checkbox" name="marketing" /> Marketing messages are optional and stay unticked.</label>
        <button className="btn btn-fill" type="button">{tx(site, fields.submitLabel)}</button>
      </form>
    </Band>
  );
}

export function Footer({ site, section }: Block) {
  const fields = readFields(recipeFields["footer.contact-map"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block footer" wrap="wrap footer-grid">
      <div>
        <h2>{site.business.name}</h2>
        <p>{tx(site, fields.address)}</p>
        <p>{tx(site, fields.hours)}</p>
      </div>
      <div id="contact">
        <p className="phone">{tx(site, fields.phoneDisplay)}</p>
        <p>{tx(site, fields.phoneNote)}</p>
        <div className="cta-row">
          <Cta site={site} label={fields.contact.label} action={fields.contact.action} className="btn btn-fill" />
          <Cta site={site} label={fields.altContact.label} action={fields.altContact.action} className="btn btn-line" />
        </div>
      </div>
      <div id="share">
        <Cta site={site} label={fields.share.label} action={fields.share.action} className="text-link" />
        <p>Your reward link is added when you publish.</p>
        <a href={fields.mapUrl}>{tx(site, fields.mapLabel)}</a>
      </div>
    </Band>
  );
}
