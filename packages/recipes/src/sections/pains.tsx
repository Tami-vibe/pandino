import { warrantyLine } from "../facts";
import { recipeFields } from "../fields";
import { photo } from "../media";
import { readFields, tx, type Block } from "../parts";

const SHOTS = ["ast_hero", "ast_before", "ast_after"];

export function PainPhotos({ site, section }: Block) {
  const fields = readFields(recipeFields["pains.cards"], section.fields);
  if (!fields) return null;
  return (
    <section id={section.id} data-group={section.group} data-label="Pains" data-icon="sentiment_dissatisfied" className="w-full py-16 md:py-24 bg-base-100" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12"><h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-base-content">{tx(site, fields.headline)}</h2><p className="text-sm md:text-base text-base-content/70 mt-3">{tx(site, fields.subhead)}</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.items.map((item, index) => {
            const image = photo(site, SHOTS[index] ?? "ast_hero");
            return (
              <article key={tx(site, item.title)} className="card bg-base-200/60 border border-primary/25 rounded-2xl overflow-hidden">
                {image ? <figure className="relative aspect-[16/10] overflow-hidden"><img src={image.src} alt={tx(site, image.alt)} className="w-full h-full object-cover" /><span className="absolute top-3 right-3 badge badge-neutral">Sample</span></figure> : null}
                <div className="card-body p-6"><h3 className="card-title text-lg">{tx(site, item.title)}</h3><p className="text-sm text-base-content/70">{tx(site, item.body)}</p></div>
              </article>
            );
          })}
        </div>
        <p className="mt-12 p-6 rounded-2xl bg-base-200/40 border border-base-content/10">{warrantyLine(site)}</p>
      </div>
    </section>
  );
}
