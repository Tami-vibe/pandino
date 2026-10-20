import { Fragment } from "react";
import type { Site } from "@pandino/schema";
import { photo } from "../media";
import { tx, type Block } from "../parts";
import { line, rows } from "./text";

const TAB = "tab text-slate-400 hover:text-white checked:bg-slate-800 checked:text-white checked:border checked:border-white/10";
const PANEL = "tab-content p-4 md:p-6 bg-base-100 rounded-2xl border border-base-300 mt-2";
const STEP = "relative z-10 flex flex-col items-center text-center w-full lg:flex-1";

export function Journey({ site, section }: Block) {
  const tabs = rows(section.fields.tabs);
  return (
    <section id="solutions" data-sid={section.id} data-group={section.group} data-label="Journey" data-icon="photo_camera" className="w-full py-20 md:py-32 bg-base-100" data-theme="dark">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary/90 block mb-1">How we work</span>
          <h2 className="tracking-tight font-extrabold text-base-content">{line(site, section.fields.headline)}</h2>
          <p className="opacity-70 mt-2 text-base">{line(site, section.fields.subhead)}</p>
        </div>
        <div aria-label="Repairs and claims" className="tabs tabs-box w-full" role="tablist">
          {tabs.map((tab, index) => (
            <Fragment key={line(site, tab.title)}>
              <input className={TAB} type="radio" name={section.id} aria-label={line(site, tab.title)} defaultChecked={index === 0} />
              <Panel site={site} tab={tab} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function Panel({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  if (tab.kind === "slider") return <Slider site={site} note={line(site, tab.body)} />;
  if (tab.kind === "cards") return <Cards site={site} tab={tab} />;
  if (tab.kind === "steps") return <Steps site={site} tab={tab} />;
  return <div className={PANEL}><p>{line(site, tab.body)}</p></div>;
}

function Cards({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  const icons = ["description", "request_quote", "directions_car"];
  return (
    <div className={PANEL}><div className="grid grid-cols-1 md:grid-cols-3 gap-5">{rows(tab.cards).map((card, index) => (
      <div key={line(site, card.title)} className="card bg-base-200/60 border border-white/[0.08] rounded-2xl"><div className="card-body p-6 gap-3">
        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-white/[0.08]"><span className="material-symbols-outlined">{icons[index] ?? "description"}</span></span>
        <h3 className="card-title text-base font-bold text-base-content">{line(site, card.title)}</h3>
        <p className="text-[13px] text-base-content/80 leading-relaxed">{line(site, card.body)}</p>
      </div></div>
    ))}</div></div>
  );
}

function Steps({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  const icons = ["photo_camera", "request_quote", "car_repair", "key"];
  return (
    <div className={PANEL}><div className="w-full p-6 bg-base-100 rounded-2xl border border-base-300 flex flex-col gap-8">
      <ul className="relative flex flex-col lg:flex-row justify-between items-stretch w-full list-none p-0 m-0">
        <span data-step-line="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 z-0 h-0.5 overflow-hidden rounded-full bg-base-content/20" />
        {rows(tab.steps).map((step, index) => (
          <li key={line(site, step.title)} className={STEP}>
            <span className="step-icon w-12 h-12 rounded-full flex items-center justify-center bg-primary text-primary-content shadow-sm"><span className="material-symbols-outlined">{icons[index] ?? "check"}</span></span>
            <span className="font-sans font-bold text-sm block mt-2 text-base-content">{line(site, step.title)}</span>
            <span className="text-[13px] text-slate-300 font-normal block max-w-[130px] mx-auto">{line(site, step.body)}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-base-content/80">{line(site, tab.body)}</p>
    </div></div>
  );
}

function Slider({ site, note }: { site: Site; note: string }) {
  const before = photo(site, "ast_before");
  const after = photo(site, "ast_after");
  return (
    <div className={PANEL}><div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <figure className="diff aspect-video rounded-xl overflow-hidden border border-base-300" aria-label="Drag to compare before and after">
        <div className="diff-item-1">{before ? <img src={before.src} alt={tx(site, before.alt)} /> : null}</div>
        <div className="diff-item-2">{after ? <img src={after.src} alt={tx(site, after.alt)} /> : null}</div>
        <div className="diff-resizer" />
      </figure>
      <p className="text-sm opacity-80">{note}</p>
    </div></div>
  );
}
