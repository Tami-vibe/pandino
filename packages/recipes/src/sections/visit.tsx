import { directionsQuery, MapboxMap, phoneLabel, placeLine } from "../facts";
import { recipeFields } from "../fields";
import { Mark } from "../media";
import { Cta, readFields, tx, type Block } from "../parts";

export function Visit({ site, section }: Block) {
  const fields = readFields(recipeFields["footer.contact-map"], section.fields);
  if (!fields) return null;
  return (
    <section id={section.id} data-group={section.group} data-label="Visit" data-icon="location_on" className="w-full py-16 md:py-24 bg-base-100">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-5 card bg-base-200/60 border border-base-content/10 p-8 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Visit us</h2>
          <p className="mt-4 flex gap-2"><Mark name="location_on" />{placeLine(site)}</p>
          <p className="mt-3 flex gap-2"><Mark name="schedule" />{site.business.hours.trim() || tx(site, fields.hours)}</p>
          <p className="mt-3 flex gap-2 font-bold"><Mark name="call" />{phoneLabel(site)}</p>
          <div className="mt-6"><Cta site={site} label={fields.contact.label} action={fields.contact.action} className="btn btn-primary h-12 px-8 rounded-full" /></div>
        </article>
        <div className="lg:col-span-7 min-h-[380px] rounded-3xl overflow-hidden border border-white/[0.08]"><MapboxMap query={directionsQuery(site)} /></div>
      </div>
    </section>
  );
}
