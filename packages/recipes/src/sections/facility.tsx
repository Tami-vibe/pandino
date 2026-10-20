import { photo } from "../media";
import { tx, type Block } from "../parts";
import { line, rows } from "./text";

const SHOT = "gal-img rounded-2xl object-cover shrink-0 shadow-md border border-base-content/10";

export function Facility({ site, section }: Block) {
  const filters = rows(section.fields.filters);
  const shots = filters.flatMap((item) => {
    const image = photo(site, String(item.assetId ?? ""));
    return image ? [{ src: image.src, alt: tx(site, image.alt), name: line(site, item.name) }] : [];
  });
  return (
    <section id="story" data-sid={section.id} data-group={section.group} data-label="Facility" data-icon="photo_camera" className="w-full py-12 md:py-20 bg-base-100" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Sample</span>
          <h2 className="text-lg font-bold text-base-content">{line(site, section.fields.headline)}</h2>
          <p className="opacity-70 mt-2 text-sm">{line(site, section.fields.subhead)}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {filters.map((item) => <span key={line(site, item.name)} className="btn btn-xs rounded-full btn-outline">{line(site, item.name)}</span>)}
        </div>
      </div>
      <div className="relative w-full overflow-hidden mask-feather-x max-w-7xl mx-auto px-4 mt-6">
        <Strip shots={shots} />
        <Strip shots={[...shots].reverse()} reverse />
      </div>
    </section>
  );
}

function Strip({ shots, reverse }: { shots: { src: string; alt: string }[]; reverse?: boolean }) {
  const row = [...shots, ...shots];
  return (
    <div className={reverse ? "flex gap-4 w-max animate-marquee hover:[animation-play-state:paused] py-2 [animation-direction:reverse]" : "flex gap-4 w-max animate-marquee hover:[animation-play-state:paused] py-2"}>
      {row.map((shot, index) => <span key={`${shot.src}-${index}`} className="gal-frame"><img className={SHOT} src={shot.src} alt={index < shots.length ? shot.alt : ""} /></span>)}
    </div>
  );
}
