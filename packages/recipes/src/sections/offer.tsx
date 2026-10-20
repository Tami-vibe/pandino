import { photo } from "../media";
import type { Block } from "../parts";
import { line, rows } from "./text";

export function Offer({ site, section }: Block) {
  const image = photo(site, "ast_hero");
  const slides = [{ headline: section.fields.headline, subhead: section.fields.subhead }, ...rows(section.fields.offers)];
  return (
    <section id={section.id} data-group={section.group} data-label="Offer" data-icon="ads_click" className="w-full py-20 relative overflow-hidden bg-base-300">
      {image ? <img src={image.src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" /> : null}
      <div className="carousel w-full relative z-10">
        {slides.map((slide, index) => (
          <div className="carousel-item w-full" id={`${section.id}-offer-${index}`} key={line(site, slide.headline)}>
            <div className="max-w-3xl mx-auto px-4 py-8 text-center space-y-4">
              <span className="badge badge-primary">Sample</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{line(site, slide.headline)}</h2>
              <p className="text-white/80">{line(site, slide.subhead)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-10 flex justify-center gap-2">{slides.map((slide, index) => <a key={line(site, slide.headline)} className="btn btn-xs btn-circle" href={`#${section.id}-offer-${index}`} aria-label={`Offer ${index + 1}`}>{index + 1}</a>)}</div>
    </section>
  );
}
