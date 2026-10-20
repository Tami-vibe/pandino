import { photo } from "../media";
import type { Block } from "../parts";
import { line } from "./text";

export function Offer({ site, section }: Block) {
  const image = photo(site, "ast_hero");
  return (
    <section id={section.id} data-group={section.group} data-label="Offer" data-icon="ads_click" className="w-full py-20 relative overflow-hidden flex items-center justify-center bg-base-300">
      {image ? <img src={image.src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" /> : null}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-4">
        <span className="badge badge-primary">Sample</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{line(site, section.fields.headline)}</h2>
        <p className="text-white/80">{line(site, section.fields.subhead)}</p>
      </div>
    </section>
  );
}
