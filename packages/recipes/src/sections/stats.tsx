import type { Block } from "../parts";
import { line, rows } from "./text";

export function Stats({ site, section }: Block) {
  const items = rows(section.fields.items);
  return (
    <section id={section.id} data-group={section.group} data-label="Stats" data-icon="verified" className="w-full py-12 md:py-20 bg-base-200" aria-label={line(site, section.fields.headline)}>
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-10">
        <div className="stats stats-vertical lg:stats-horizontal bg-base-200 w-full border border-white/[0.08] rounded-2xl">
          {items.map((item) => <div key={line(site, item.label)} className="stat"><div className="stat-title uppercase text-xs tracking-wider">{line(site, item.label)}</div><div className="stat-value text-primary">{line(site, item.value)}</div><div className="stat-desc">{line(site, section.fields.subhead)}</div></div>)}
        </div>
      </div>
    </section>
  );
}
