import { actionHref, liveAction, pageHref, type Block } from "../parts";
import { line, rows } from "./text";

export function Faq({ site, section }: Block) {
  const items = rows(section.fields.items);
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }));
  return (
    <section id={section.id} data-group={section.group} data-label="FAQ" data-icon="description" className="w-full py-16 md:py-24 bg-base-100" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary block">Sample</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-base-content">{line(site, section.fields.headline)}</h2>
          <p className="text-base-content/70">{line(site, section.fields.subhead)}</p>
          <div className="flex flex-wrap gap-3"><a className="btn btn-sm h-10 px-5 rounded-full btn-primary" href={call}>Call</a><a className="btn btn-sm h-10 px-5 rounded-full bg-base-content/10 border border-base-content/10" href={pageHref("estimate", "file")}>Get an estimate</a></div>
        </div>
        <div className="lg:col-span-7 join join-vertical w-full border border-white/[0.08] rounded-2xl bg-base-200/60 divide-y divide-white/[0.08]">
          {items.map((item, index) => (
            <div key={line(site, item.q)} className="collapse collapse-arrow join-item">
              <input type="radio" name={section.id} defaultChecked={index === 0} aria-label={line(site, item.q)} />
              <div className="collapse-title text-base font-bold">{line(site, item.q)}</div>
              <div className="collapse-content text-sm opacity-80">{line(site, item.a)}</div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
