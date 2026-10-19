import { z } from "zod";
import { Band, readFields, tx, type Block } from "./parts";

const copy = z.record(z.string(), z.string().min(1));
const legalFields = z.object({ headline: copy, body: copy });

export function Legal({ site, section }: Block) {
  const fields = readFields(legalFields, section.fields);
  if (!fields) return null;
  const title = tx(site, fields.headline);
  return (
    <Band id={section.id} group={section.group} label={title} variant={section.variant} className="block legal" wrap="wrap" title={title} icon="description" style={section.style}>
      <article className="prose">
        {tx(site, fields.body).split("\n\n").map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
      </article>
    </Band>
  );
}
