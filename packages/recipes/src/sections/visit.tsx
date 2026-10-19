import { directionsQuery, MapboxMap, phoneLabel, placeLine } from "../facts";
import { recipeFields } from "../fields";
import { Mark } from "../media";
import { Band, Cta, readFields, tx, type Block } from "../parts";

export function Visit({ site, section }: Block) {
  const fields = readFields(recipeFields["footer.contact-map"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label="Visit" variant={section.variant} icon="location_on" className="block visit" wrap="wrap" title="Visit us." style={section.style}>
      <div className="visit-grid">
        <article className="card glass">
          <p className="contact-line"><Mark name="location_on" />{placeLine(site)}</p>
          <p className="contact-line"><Mark name="schedule" />{site.business.hours.trim() || tx(site, fields.hours)}</p>
          <p className="phone"><Mark name="call" />{phoneLabel(site)}</p>
          <div className="cta-row">
            <Cta site={site} label={fields.contact.label} action={fields.contact.action} className="btn btn-fill" />
          </div>
        </article>
        <MapboxMap query={directionsQuery(site)} />
      </div>
    </Band>
  );
}
