import { ReviewBadge } from "./facts";
import { recipeFields } from "./fields";
import { anyPhoto, Mark, photo } from "./media";
import { Band, Cta, readFields, tx, type Block } from "./parts";

const PAIN_ICONS = ["description", "schedule", "format_paint"];
const MENU_ICONS = ["car_repair", "format_paint", "minor_crash", "directions_car"];

export function Hero({ site, section }: Block) {
  const fields = readFields(recipeFields["hero.split-photo"], section.fields);
  if (!fields) return null;
  const slides = [photo(site, fields.image.assetId), photo(site, "ast_before"), photo(site, "ast_after")].flatMap((item) => item ? [item] : []);
  return (
    <section id={section.id} data-group={section.group} data-label="Hero" data-icon="minor_crash" data-variant={section.variant} className="hero w-full relative overflow-hidden flex items-center justify-center" data-hero-tier="full" data-layout="1" data-hero-fx="fade" data-hero-ease="smooth" data-panel="off">
      <div className="carousel w-full h-full absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {slides.map((item, index) => <div key={item.src} className={index ? "carousel-item absolute inset-0 w-full h-full" : "carousel-item absolute inset-0 w-full h-full is-active"}><img src={item.src} alt={tx(site, item.alt)} className="w-full h-full object-cover" /></div>)}
        <span className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--color-base-100)] via-[var(--color-base-100)]/60 to-transparent pointer-events-none z-10" />
      <div className="hero-content text-center z-20 max-w-4xl px-4 my-auto pt-16 pb-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <ReviewBadge site={site} />
          <span className="eyebrow-pill mb-3">{tx(site, fields.eyebrow)}</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">{tx(site, fields.headline)}</h1>
          <p className="py-2 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">{tx(site, fields.subhead)}</p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Cta site={site} label={fields.primaryCta.label} action={fields.primaryCta.action} className="btn btn-primary h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/25" />
            <Cta site={site} label={fields.secondaryCta.label} action={fields.secondaryCta.action} className="btn h-12 px-8 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-md" />
          </div>
        </div>
      </div>
    </section>
  );
}

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
