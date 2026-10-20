import type { CSSProperties } from "react";
import type { Site } from "@pandino/schema";
import { ReviewBadge } from "../facts";
import { recipeFields } from "../fields";
import { photo } from "../media";
import { Cta, readFields, tx, type Block } from "../parts";

function heroFields(section: Block["section"]) {
  return readFields(recipeFields["hero.split-photo"], section.fields);
}

type Fields = NonNullable<ReturnType<typeof heroFields>>;

export function Hero({ site, section }: Block) {
  const fields = heroFields(section);
  if (!fields) return null;
  return (
    <section id="hero" data-sid={section.id} data-group={section.group} data-label="Hero" data-icon="minor_crash" data-variant={section.variant} className="hero w-full relative overflow-hidden flex items-center justify-center" data-hero-tier="full" data-theme="dark" data-shade={fields.shade ?? "bottom"} style={heroVars(fields, section.style.overlay)}>
      <HeroMedia site={site} fields={fields} />
      <HeroCopy site={site} fields={fields} />
    </section>
  );
}

function heroVars(fields: Fields, overlay: number): CSSProperties {
  const look = fields.look ?? {};
  return {
    "--hero-veil": String(overlay),
    "--hero-tlh": String(look.tlh ?? 1.05),
    "--hero-tw": String(look.tw ?? 800),
    "--hero-ttr": `${look.ttr ?? -0.03}em`,
    "--hero-slh": String(look.slh ?? 1.5),
    "--hero-sw": String(look.sw ?? 400),
    "--hero-str": `${look.str ?? 0}em`,
    "--hero-sz": String(look.sz ?? 1),
  } as CSSProperties;
}

function HeroMedia({ site, fields }: { site: Site; fields: Fields }) {
  const ids = fields.slides?.length ? fields.slides : ["ast_before", "ast_after", fields.image.assetId];
  const slides = ids.flatMap((id) => { const item = photo(site, id); return item ? [item] : []; });
  const last = slides.length - 1;
  return (
    <div className="carousel w-full h-full absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {slides.map((item, index) => (
        <div key={`${index}-${item.src.slice(0, 24)}`} className={index === last ? "carousel-item absolute inset-0 w-full h-full is-active" : "carousel-item absolute inset-0 w-full h-full"}>
          {item.type === "video" ? <video src={item.src} className="w-full h-full object-cover" muted autoPlay loop playsInline /> : <img src={item.src} alt={tx(site, item.alt)} className="w-full h-full object-cover" />}
        </div>
      ))}
      <span />
    </div>
  );
}

function HeroCopy({ site, fields }: { site: Site; fields: Fields }) {
  return (
    <div className="hero-content text-center z-20 max-w-4xl px-4 my-auto pt-16 pb-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <ReviewBadge site={site} />
        <span className="eyebrow-pill mb-3">{tx(site, fields.eyebrow)}</span>
        <h1 className="text-4xl md:text-6xl text-white drop-shadow-md">{tx(site, fields.headline)}</h1>
        <p className="hero-sub py-2 text-sm sm:text-base text-slate-300 max-w-xl">{tx(site, fields.subhead)}</p>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <Cta site={site} icon={fields.primaryCta.icon} label={fields.primaryCta.label} action={fields.primaryCta.action} className="btn btn-primary h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/25" />
          <Cta site={site} icon={fields.secondaryCta.icon} label={fields.secondaryCta.label} action={fields.secondaryCta.action} className="btn h-12 px-8 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-md" />
        </div>
      </div>
    </div>
  );
}
