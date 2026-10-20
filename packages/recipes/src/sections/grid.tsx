import { recipeFields } from "../fields";
import { pageHref } from "../href";
import { readFields, tx, type Block } from "../parts";

const ICONS = ["car_repair", "format_paint", "minor_crash", "directions_car", "construction", "search"];

export function ServiceGrid({ site, section }: Block) {
  const fields = readFields(recipeFields["services.menu-from-prices"], section.fields);
  if (!fields) return null;
  const href = pageHref("services", "file");
  const cols = fields.perRow === "2" ? "lg:grid-cols-2" : fields.perRow === "4" ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section id={section.id} data-group={section.group} data-label="Services" data-icon="construction" className="w-full py-20 md:py-32 bg-base-200" data-theme="dark" aria-labelledby="svc-title" data-align="center" data-card-align="left" data-action-align="start">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto"><span className="eyebrow-pill mb-3">Our services</span><h2 id="svc-title" className="tracking-tight font-extrabold text-base-content mt-1">{tx(site, fields.headline)}</h2><p className="opacity-70 mt-3 text-base">{tx(site, fields.subhead)}</p></div>
        <ul className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-6 w-full p-0 m-0 list-none`}>
          {fields.items.map((item, index) => (
            <li key={tx(site, item.name)} className="card studio-card border border-white/[0.08] bg-base-200/60 rounded-2xl">
              <a className="card-body p-6 flex flex-col justify-between no-underline" href={href}>
                <span className="material-symbols-outlined text-primary text-3xl mb-2" aria-hidden="true">{ICONS[index] ?? "car_repair"}</span>
                <h3 className="card-title font-bold text-base-content">{tx(site, item.name)}</h3>
                <p className="text-sm opacity-80 text-base-content">{tx(site, item.detail)}</p>
                <span className="svc-action inline-flex items-center gap-1 text-sm font-semibold text-primary mt-2">Learn more</span>
              </a>
            </li>
          ))}
          <li className="card studio-card border border-white/[0.08] rounded-2xl bg-primary/15"><a className="card-body p-6 flex items-center font-bold text-primary no-underline" href={href}>Explore all services</a></li>
        </ul>
      </div>
    </section>
  );
}
