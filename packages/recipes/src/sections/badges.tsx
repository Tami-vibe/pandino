import type { Block } from "../parts";
import { line, rows } from "./text";

export function BadgeBar({ site, section }: Block) {
  const badges = rows(section.fields.badges);
  return (
    <section id={section.id} data-group={section.group} data-label="Trust bar" data-icon="check_circle" className="w-full py-8 bg-base-100" aria-label={line(site, section.fields.headline)}>
      <div className="w-full max-w-7xl mx-auto px-4">
        <ul className="flex flex-wrap items-center justify-center gap-3 list-none p-0 m-0">
          {badges.map((badge) => <li key={line(site, badge)} className="badge badge-outline gap-2">{line(site, badge)}</li>)}
        </ul>
      </div>
    </section>
  );
}
