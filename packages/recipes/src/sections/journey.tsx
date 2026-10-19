import type { Site } from "@pandino/schema";
import { photo, Shot } from "../media";
import { Band, tx, type Block } from "../parts";
import { line, rows } from "./text";

export function Journey({ site, section }: Block) {
  const tabs = rows(section.fields.tabs);
  return (
    <Band id={section.id} group={section.group} label="Journey" variant={section.variant} icon="photo_camera" className="block journey" wrap="wrap" title={line(site, section.fields.headline)} body={line(site, section.fields.subhead)} style={section.style}>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <label key={line(site, tab.title)}><input type="radio" name={section.id} defaultChecked={index === 0} />{line(site, tab.title)}</label>
        ))}
        {tabs.map((tab) => <Panel key={line(site, tab.title)} site={site} tab={tab} />)}
      </div>
    </Band>
  );
}

function Panel({ site, tab }: { site: Site; tab: Record<string, unknown> }) {
  if (tab.kind === "slider") return <Slider site={site} note={line(site, tab.body)} />;
  return <div className="panel card glass"><p>{line(site, tab.body)}</p></div>;
}

function Slider({ site, note }: { site: Site; note: string }) {
  const before = photo(site, "ast_before");
  const after = photo(site, "ast_after");
  return (
    <div className="panel">
      <div className="ba">
        <div className="under"><Shot label="Before — sample" src={before?.src} alt={before ? tx(site, before.alt) : undefined} /></div>
        <div className="over"><Shot label="After — sample" src={after?.src} alt={after ? tx(site, after.alt) : undefined} /></div>
        <input type="range" min={0} max={100} defaultValue={50} aria-label="Before and after" onInput={(event) => event.currentTarget.parentElement?.style.setProperty("--pos", `${event.currentTarget.value}%`)} />
      </div>
      <p className="note">{note}</p>
    </div>
  );
}
