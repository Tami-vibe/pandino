import { photo } from "../media";
import { tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Facility({ site, section }: Block) {
  const filters = rows(section.fields.filters);
  return (
    <section id={section.id} data-group={section.group} data-label="Facility" data-icon="photo_camera" className="w-full py-12 md:py-20 bg-base-200/40">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto"><h2 className="tracking-tight font-extrabold text-base-content">{line(site, section.fields.headline)}</h2><p className="opacity-70 mt-2">{line(site, section.fields.subhead)}</p></div>
        <div className="filters">
          <div className="chip-row flex flex-wrap justify-center gap-2">
            {filters.map((item, index) => <label key={line(site, item.name)} className="btn btn-sm rounded-full">{line(site, item.name)}<input className="pick" type="radio" name={section.id} defaultChecked={index === 0} /></label>)}
          </div>
          <div className="filter-stage mt-6">
            {filters.map((item) => {
              const image = photo(site, String(item.assetId ?? ""));
              return <div key={String(item.assetId)} className="shot-frame rounded-3xl border border-base-content/10">{image ? <img src={image.src} alt={tx(site, image.alt)} /> : null}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
