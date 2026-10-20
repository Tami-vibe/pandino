import type { Site } from "@pandino/schema";
import { photo } from "../media";
import { tx, type Block } from "../parts";
import { Cards, Steps } from "./panels";
import { line, rows } from "./text";

export function Journey({ site, section }: Block) {
  const tabs = rows(section.fields.tabs);
  return (
    <section id={section.id} data-group={section.group} data-label="Journey" data-icon="photo_camera" className="w-full py-20 md:py-32 bg-base-100">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto"><h2 className="tracking-tight font-extrabold text-base-content">{line(site, section.fields.headline)}</h2><p className="opacity-70 mt-2">{line(site, section.fields.subhead)}</p></div>
        <div className="tabs tabs-box w-full" role="tablist">
          {tabs.flatMap((tab, index) => [
            <input key={line(site, tab.title)} className="tab" type="radio" name={section.id} aria-label={line(site, tab.title)} defaultChecked={index === 0} />,
            <Panel key={`p-${line(site, tab.title)}`} site={site} tab={tab} />,
          ])}
        </div>
      </div>
    </section>
  );
}

function Panel({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  if (tab.kind === "slider") return <Slider site={site} note={line(site, tab.body)} />;
  if (tab.kind === "cards") return <Cards site={site} tab={tab} />;
  if (tab.kind === "steps") return <Steps site={site} tab={tab} />;
  return <div className="tab-content p-6 bg-base-100 rounded-2xl border border-base-300 mt-2"><p>{line(site, tab.body)}</p></div>;
}

function Slider({ site, note }: { site: Site; note: string }) {
  const before = photo(site, "ast_before");
  const after = photo(site, "ast_after");
  return (
    <div className="tab-content p-6 bg-base-100 rounded-2xl border border-base-300 mt-2">
      <div className="ba rounded-xl overflow-hidden">
        <div className="under">{before ? <img className="shot w-full object-cover" src={before.src} alt={tx(site, before.alt)} /> : null}</div>
        <div className="over">{after ? <img className="shot w-full object-cover" src={after.src} alt={tx(site, after.alt)} /> : null}</div>
        <input type="range" min={0} max={100} defaultValue={50} aria-label="Before and after" onInput={(event) => event.currentTarget.parentElement?.style.setProperty("--pos", `${event.currentTarget.value}%`)} />
      </div>
      <p className="note mt-3">{note}</p>
    </div>
  );
}
