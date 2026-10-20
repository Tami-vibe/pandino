import { actionHref, liveAction, pageHref, type Block } from "../parts";
import { line } from "./text";

export function CtaBand({ site, section }: Block) {
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }));
  return (
    <section id={section.id} data-group={section.group} data-label="Call to action" data-icon="call" className="w-full py-20 md:py-28 relative overflow-hidden bg-base-100 border-t border-base-content/10" data-theme="dark">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-primary)_22%,transparent)_0%,transparent_70%)]" />
      <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center text-center gap-6">
        <h2 className="font-extrabold text-3xl md:text-5xl text-white">{line(site, section.fields.headline)}</h2>
        <p className="text-slate-300">{line(site, section.fields.subhead)}</p>
        <div className="flex flex-wrap gap-4"><a className="btn btn-primary h-12 px-8 rounded-full font-semibold" href={call}>Call</a><a className="btn h-12 px-8 rounded-full bg-white/10 text-white border border-white/10" href={pageHref("estimate", "file")}>Get an estimate</a></div>
      </div>
    </section>
  );
}
