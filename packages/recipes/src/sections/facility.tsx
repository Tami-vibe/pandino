import { photo } from "../media";
import { tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Facility({ site, section }: Block) {
  const shots = rows(section.fields.filters);
  return (
    <section id={section.id} data-group={section.group} data-label="Gallery" data-icon="photo_camera" className="w-full py-12 md:py-20 bg-base-200/40 overflow-hidden">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto"><span className="eyebrow-pill mb-3">Gallery</span><h2 className="tracking-tight font-extrabold text-base-content">{line(site, section.fields.headline)}</h2><p className="opacity-70 mt-2">{line(site, section.fields.subhead)}</p></div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <Strip site={site} shots={shots} reverse={false} />
        <Strip site={site} shots={shots} reverse />
      </div>
    </section>
  );
}

function Strip({ site, shots, reverse }: { site: Block["site"]; shots: Record<string, unknown>[]; reverse: boolean }) {
  const row = reverse ? "flex gap-4 w-max animate-marquee py-2 [animation-direction:reverse]" : "flex gap-4 w-max animate-marquee py-2";
  return (
    <div className={row}>
      {[0, 1].map((copy) => shots.map((item) => {
        const image = photo(site, String(item.assetId ?? ""));
        const name = line(site, item.name);
        return (
          <figure key={`${copy}-${name}`} className="m-0 shrink-0 w-64" aria-hidden={copy === 1 ? true : undefined}>
            <div className="shot-frame gal-img rounded-2xl border border-base-content/10">{image ? <img src={image.src} alt={copy ? "" : tx(site, image.alt)} /> : null}</div>
            <figcaption className="text-xs mt-1 opacity-70">{name}</figcaption>
          </figure>
        );
      }))}
    </div>
  );
}
