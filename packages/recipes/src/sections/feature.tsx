import { photo } from "../media";
import { tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Feature({ site, section }: Block) {
  const specs = rows(section.fields.specs);
  const image = photo(site, "ast_shop") ?? photo(site, "ast_after");
  return (
    <section id={section.id} data-group={section.group} data-label="Feature" data-icon="construction" className="w-full py-12 md:py-20 bg-base-100">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto"><h2 className="tracking-tight font-extrabold text-base-content">{line(site, section.fields.headline)}</h2><p className="opacity-70 mt-2 text-base">{line(site, section.fields.subhead)}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-base-content/10">{image ? <img src={image.src} alt={tx(site, image.alt)} className="w-full h-full object-cover" /> : null}</div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specs.map((spec) => <div key={line(site, spec.label)} className="p-4 rounded-2xl bg-base-200/60 border border-white/[0.08]"><dt className="text-xs uppercase tracking-wider opacity-70">{line(site, spec.label)}</dt><dd className="font-bold mt-1">{line(site, spec.value)}</dd></div>)}
          </dl>
        </div>
      </div>
    </section>
  );
}
