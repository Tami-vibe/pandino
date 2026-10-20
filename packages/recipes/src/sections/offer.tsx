import { photo } from "../media";
import type { Block } from "../parts";
import { line, rows } from "./text";

export function Offer({ site, section }: Block) {
  const image = photo(site, "ast_hero");
  const extra = rows(section.fields.offers);
  const slides = extra.length ? extra : [{ headline: section.fields.headline, subhead: section.fields.subhead }];
  return (
    <section id={section.id} data-group={section.group} data-label="Offer" data-icon="ads_click" className="w-full py-20 relative overflow-hidden flex items-center justify-center bg-base-300" data-theme="dark">
      {image ? <img src={image.src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" /> : null}
      <div className="carousel w-full relative z-10">
        {slides.map((slide, index) => (
          <div key={line(site, slide.headline)} id={`${section.id}-offer-${index}`} className="carousel-item w-full">
            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-6 py-6">
              <span className="badge badge-primary font-mono text-xs font-bold py-3 px-4 uppercase tracking-widest">Sample</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{line(site, slide.headline)}</h2>
              <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">{line(site, slide.subhead)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 z-20 flex gap-2">
        {slides.map((slide, index) => <a key={line(site, slide.headline)} className="btn btn-xs btn-circle btn-primary" href={`#${section.id}-offer-${index}`}>{index + 1}</a>)}
      </div>
    </section>
  );
}
