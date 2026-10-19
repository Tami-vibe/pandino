import { warrantyLine } from "../facts";
import { recipeFields } from "../fields";
import { Mark, photo, Shot } from "../media";
import { Band, readFields, tx, type Block } from "../parts";

const SHOTS = ["ast_hero", "ast_before", "ast_after"];

export function PainPhotos({ site, section }: Block) {
  const fields = readFields(recipeFields["pains.cards"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label="Pains" variant={section.variant} icon="sentiment_dissatisfied" className="block" wrap="wrap" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} style={section.style}>
      <div className="pain-grid">
        {fields.items.map((item, index) => (
          <Pain key={tx(site, item.title)} site={site} title={tx(site, item.title)} body={tx(site, item.body)} shot={SHOTS[index] ?? "ast_hero"} />
        ))}
      </div>
      <p className="guarantee"><Mark name="verified" />{warrantyLine(site)}</p>
    </Band>
  );
}

function Pain({ site, title, body, shot }: { site: Block["site"]; title: string; body: string; shot: string }) {
  const image = photo(site, shot);
  return (
    <article className="card pain glass">
      <Shot label="Sample photo. Not this shop." src={image?.src} alt={image ? tx(site, image.alt) : undefined} />
      <span className="chip">Sample</span>
      <h3>{title}</h3>
      <p className="chips"><span>{body}</span></p>
    </article>
  );
}
