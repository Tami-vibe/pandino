import { recipeFields } from "./fields";
import { anyPhoto, Mark, photo, Shot } from "./media";
import { Band, readFields, tx, type Block } from "./parts";

export function Reviews({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.reviews-certs"], section.fields);
  if (!fields) return null;
  const team = photo(site, "ast_shop");
  return (
    <Band id={section.id} group={section.group} label="Reviews" className="block" wrap="wrap split" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="verified" style={section.style} image={anyPhoto(site)}>
      <div>
        {fields.reviews.map((review) => (
          <blockquote key={tx(site, review.quote)} className="card review">
            <span className="chip">Sample</span>
            <p>{tx(site, review.quote)}</p>
            <footer>{tx(site, review.author)}</footer>
          </blockquote>
        ))}
      </div>
      <aside className="card certs">
        <h3><Mark name="groups" />Certifications</h3>
        <p>{tx(site, fields.certificationsNote)}</p>
        <Shot label="Add a photo of your team and shop" src={team?.src} alt={team ? tx(site, team.alt) : undefined} />
      </aside>
    </Band>
  );
}

export function Gallery({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.before-after"], section.fields);
  if (!fields) return null;
  const before = photo(site, fields.before.assetId);
  const after = photo(site, fields.after.assetId);
  return (
    <Band id={section.id} group={section.group} label="Gallery" className="block band" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="photo_camera" style={section.style} image={anyPhoto(site)}>
      <div className="pair">
        <Shot label="Before — add your photo" src={before?.src} alt={before ? tx(site, before.alt) : undefined} />
        <Shot label="After — add your photo" src={after?.src} alt={after ? tx(site, after.alt) : undefined} />
      </div>
      <p className="note">{tx(site, fields.caption)}</p>
    </Band>
  );
}
