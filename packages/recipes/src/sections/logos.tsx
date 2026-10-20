import type { Block } from "../parts";
import { line, rows } from "./text";

export function Logos({ site, section }: Block) {
  const brands = rows(section.fields.brands).map((brand) => line(site, brand));
  const row = brands.map((brand) => <span key={brand}>{brand}</span>);
  return (
    <section id="logostrip" data-sid={section.id} data-group={section.group} data-label="Brands" data-icon="directions_car" className="w-full py-8 overflow-hidden relative mask-feather-x" data-theme="dark" aria-label={line(site, section.fields.headline)}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center gap-12 min-w-full justify-around text-sm font-bold tracking-wider uppercase opacity-60">{row}</div>
        <div className="flex shrink-0 items-center gap-12 min-w-full justify-around text-sm font-bold tracking-wider uppercase opacity-60" aria-hidden="true">{brands.map((brand) => <span key={`b-${brand}`}>{brand}</span>)}</div>
      </div>
    </section>
  );
}
