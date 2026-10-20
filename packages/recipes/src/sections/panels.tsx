import type { Site } from "@pandino/schema";
import { line, rows } from "./text";

export function Cards({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  return (
    <div className="tab-content p-6 bg-base-100 rounded-2xl border border-base-300 mt-2">
      <p className="opacity-80 mb-4">{line(site, tab.body)}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {rows(tab.cards).map((card) => (
          <article key={line(site, card.title)} className="card bg-base-200/60 border border-white/[0.08] rounded-2xl">
            <div className="card-body p-6 gap-2"><h3 className="card-title text-base font-bold">{line(site, card.title)}</h3><p className="text-sm opacity-80">{line(site, card.body)}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Steps({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  return (
    <div className="tab-content p-6 bg-base-100 rounded-2xl border border-base-300 mt-2">
      <ul className="steps steps-horizontal w-full">
        {rows(tab.steps).map((step, index) => (
          <li key={line(site, step.title)} className="step step-primary">{index + 1}. {line(site, step.title)}<span className="block font-normal opacity-70">{line(site, step.body)}</span></li>
        ))}
      </ul>
      <span className="step-line" aria-hidden="true" />
      <p className="mt-4">{line(site, tab.body)}</p>
    </div>
  );
}
