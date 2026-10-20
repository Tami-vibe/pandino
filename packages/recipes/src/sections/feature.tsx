import { photo } from "../media";
import { tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Feature({ site, section }: Block) {
  const specs = rows(section.fields.specs);
  const image = photo(site, "ast_shop") ?? photo(site, "ast_after");
  return (
    <section id={section.id} data-group={section.group} data-label="Feature" data-icon="construction" className="w-full py-12 md:py-20 bg-base-100" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto"><span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary/90 block mb-1">About the shop</span><h2 className="tracking-tight font-extrabold text-base-content mt-1">{line(site, section.fields.headline)}</h2><p className="opacity-70 mt-2 text-base">{line(site, section.fields.subhead)}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-base-content/10">{image ? <img src={image.src} alt={tx(site, image.alt)} className="w-full h-full object-cover" /> : null}</div>
          <div className="flex flex-col gap-4">
            <span className="badge badge-primary badge-outline text-xs font-mono font-bold py-2.5 px-3 uppercase tracking-wider w-fit">Sample</span>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specs.map((spec) => <div key={line(site, spec.label)} className="p-3 bg-base-100/60 rounded-xl border border-base-300/60"><dt className="text-xs font-bold text-primary">{line(site, spec.label)}</dt><dd className="text-xs text-base-content/70">{line(site, spec.value)}</dd></div>)}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
