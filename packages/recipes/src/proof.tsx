import { recipeFields } from "./fields";
import { anyPhoto, Mark, photo, Shot } from "./media";
import { Band, readFields, tx, type Block } from "./parts";

export function Reviews({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.reviews-certs"], section.fields);
  if (!fields) return null;
  const team = photo(site, "ast_shop");
  const cards = site.reviews.length ? site.reviews.slice(0, 3).map((review) => ({ id: review.id, text: review.text, author: review.author, sample: review.source === "sample" })) : fields.reviews.map((review) => ({ id: tx(site, review.quote), text: tx(site, review.quote), author: tx(site, review.author), sample: true }));
  return (
    <section id="reviews" data-sid={section.id} data-group={section.group} data-label="Reviews" data-icon="verified" className="w-full py-12 md:py-20 bg-base-200" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto"><span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary/90 block mb-1">Reviews</span><h2 className="tracking-tight font-extrabold text-base-content">{tx(site, fields.headline)}</h2><p className="opacity-70 mt-2">{tx(site, fields.subhead)}</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((review) => (
            <blockquote key={review.id} className="card border border-white/[0.08] bg-base-200/60 rounded-2xl">
              <div className="card-body p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3"><span className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">{review.author.trim().charAt(0) || "S"}</span><div><b className="text-sm block">{review.author}</b><small className="text-xs opacity-60">{review.sample ? "Sample" : "Recent"}</small></div></div>
                <div className="text-warning text-sm" aria-label="Sample rating">★★★★★</div>
                <p className="text-sm opacity-80 leading-relaxed">{review.text}</p>
              </div>
            </blockquote>
          ))}
        </div>
        {site.reviews.length ? null : <aside className="card certs"><h3><Mark name="groups" />Certifications</h3><p>{tx(site, fields.certificationsNote)}</p><Shot label="Add a photo of your team and shop" src={team?.src} alt={team ? tx(site, team.alt) : undefined} /></aside>}
      </div>
    </section>
  );
}

export function Gallery({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.before-after"], section.fields);
  if (!fields) return null;
  const before = photo(site, fields.before.assetId);
  const after = photo(site, fields.after.assetId);
  return (
    <Band id={section.id} group={section.group} label="Gallery" variant={section.variant} className="block band" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="photo_camera" style={section.style} image={anyPhoto(site)}>
      <div className="pair">
        <Shot label="Before — add your photo" src={before?.src} alt={before ? tx(site, before.alt) : undefined} />
        <Shot label="After — add your photo" src={after?.src} alt={after ? tx(site, after.alt) : undefined} />
      </div>
      <p className="note">{tx(site, fields.caption)}</p>
    </Band>
  );
}
