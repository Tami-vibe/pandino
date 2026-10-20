import { actionHref, liveAction, pageHref, type Block } from "../parts";
import { line, rows } from "./text";

export function Faq({ site, section }: Block) {
  const items = rows(section.fields.items);
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }));
  return (
    <section id={section.id} data-group={section.group} data-label="FAQ" data-icon="description" className="w-full py-16 md:py-24 bg-base-100">
      <div className="kit-split w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{line(site, section.fields.headline)}</h2>
          <p className="text-base-content/70">{line(site, section.fields.subhead)}</p>
          <div className="flex flex-wrap gap-3"><a className="btn btn-sm h-10 px-5 rounded-full btn-primary" href={call}>Call</a><a className="btn btn-sm h-10 px-5 rounded-full bg-base-content/10 border border-base-content/10" href={pageHref("estimate", "file")}>Get an estimate</a></div>
        </div>
        <div className="lg:col-span-7 join join-vertical w-full border border-white/[0.08] rounded-2xl bg-base-200/60">
          {items.map((item, index) => <details key={line(site, item.q)} className="collapse collapse-arrow join-item" open={index === 0}><summary className="collapse-title font-bold">{line(site, item.q)}</summary><p className="collapse-content text-sm opacity-80">{line(site, item.a)}</p></details>)}
        </div>
      </div>
    </section>
  );
}
