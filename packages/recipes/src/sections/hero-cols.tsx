import type { Site } from "@pandino/schema";
import { recipeFields } from "../fields";
import { photo } from "../media";
import { readFields, tx } from "../parts";

type Fields = NonNullable<ReturnType<typeof readHero>>;

function readHero(fields: unknown) {
  return readFields(recipeFields["hero.split-photo"], fields);
}

export function HeroColumns({ site, fields }: { site: Site; fields: Fields }) {
  const count = Number(fields.columns ?? "1");
  const cols = fields.cols ?? [];
  return Array.from({ length: count }, (_, index) => {
    const col = cols[index];
    const media = col?.assetId ? photo(site, col.assetId) : undefined;
    const copy = col?.text ? tx(site, col.text) : "";
    return (
      <div className="hero-col" key={index} data-place={col?.place ?? "center"}>
        {media?.type === "video" ? <video src={media.src} muted autoPlay loop playsInline /> : media ? <img src={media.src} alt={tx(site, media.alt)} /> : null}
        {copy ? <p className="hero-box" style={col?.color ? { background: col.color } : undefined}>{copy}</p> : null}
      </div>
    );
  });
}
