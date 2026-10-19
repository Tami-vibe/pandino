import { recipeFields } from "./fields";
import { Band, Frame, readFields, tx, type Block } from "./parts";

export function Reviews({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.reviews-certs"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block" wrap="wrap split" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <div>
        {fields.reviews.map((review) => (
          <blockquote key={tx(site, review.quote)} className="card review">
            <span className="chip">Placeholder</span>
            <p>{tx(site, review.quote)}</p>
            <footer>{tx(site, review.author)}</footer>
          </blockquote>
        ))}
      </div>
      <aside className="card certs">
        <h3>Certifications</h3>
        <p>{tx(site, fields.certificationsNote)}</p>
        <Frame label="Add a photo of your team and shop" />
      </aside>
    </Band>
  );
}

export function Gallery({ site, section }: Block) {
  const fields = readFields(recipeFields["trust.before-after"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} className="block band" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <div className="pair">
        <Frame label="Before — add your photo" />
        <Frame label="After — add your photo" />
      </div>
      <p className="note">{tx(site, fields.caption)}</p>
    </Band>
  );
}
