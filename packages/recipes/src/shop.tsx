import { directionsQuery, MapboxMap, Payments, phoneLabel, placeLine, warrantyLine } from "./facts";
import { recipeFields } from "./fields";
import { anyPhoto, Mark } from "./media";
import { Band, Cta, readFields, tx, type Block } from "./parts";

const PROMISE = "Photos and a written estimate before any work. No surprise charges.";
const STEP_ICONS = ["photo_camera", "request_quote", "car_repair", "check_circle"];

export function Process({ site, section }: Block) {
  const fields = readFields(recipeFields["services.process-insurance"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label="Process" className="block band promise" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="check_circle" style={section.style} image={anyPhoto(site)}>
      <p className="promise-line"><Mark name="verified" />{PROMISE}</p>
      <ol className="steps">
        {fields.steps.map((step, index) => (
          <li key={tx(site, step.title)}>
            <Mark name={STEP_ICONS[index] ?? "check_circle"} />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{tx(site, step.title)}</h3>
            <p>{tx(site, step.body)}</p>
          </li>
        ))}
      </ol>
      <p className="note">{tx(site, fields.note)}</p>
      <p className="note">{warrantyLine(site)}</p>
      <Payments site={site} />
    </Band>
  );
}

export function Footer({ site, section }: Block) {
  const fields = readFields(recipeFields["footer.contact-map"], section.fields);
  if (!fields) return null;
  const email = site.business.email.trim();
  const emailLine = email === "info@futura-example.it" ? `${email} (sample)` : email || "Add your email";
  return (
    <Band id={section.id} group={section.group} label="Footer" className="block footer" wrap="wrap footer-grid" style={section.style} image={anyPhoto(site)}>
      <div>
        <h2>{site.business.name}</h2>
        <p className="contact-line"><Mark name="location_on" />{placeLine(site)}</p>
        <p className="contact-line"><Mark name="schedule" />{site.business.hours.trim() || "Add your opening hours"}</p>
        <p className="contact-line"><Mark name="mail" />{emailLine}</p>
      </div>
      <div>
        <p className="phone"><Mark name="call" />{phoneLabel(site)}</p>
        <p>{tx(site, fields.phoneNote)}</p>
        <div className="cta-row">
          <Cta site={site} label={fields.contact.label} action={fields.contact.action} className="btn btn-fill" />
          <Cta site={site} label={fields.altContact.label} action={fields.altContact.action} className="btn btn-line" />
        </div>
        <Cta site={site} label={fields.share.label} action={fields.share.action} className="text-link" />
      </div>
      <MapboxMap query={directionsQuery(site)} />
    </Band>
  );
}
