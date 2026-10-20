"use client";

import { useState } from "react";
import type { Site } from "@pandino/schema";
import { addHeroMedia } from "./upload";

type Section = Site["pages"][number]["sections"][number];
type Bag = Record<string, unknown>;
type Look = { tlh?: number; tw?: number; ttr?: number; slh?: number; sw?: number; str?: number };
const ICONS = ["", "call", "calendar_month", "arrow_forward", "mail", "directions_car"];
const NAMES: Record<string, string> = { "": "None", call: "Call", calendar_month: "Calendar", arrow_forward: "Arrow", mail: "Mail", directions_car: "Car" };
const BASE: Look = { tlh: 1.05, tw: 800, ttr: -0.03, slh: 1.5, sw: 400, str: 0 };

export function HeroControls({ site, section, onSite }: { site: Site; section: Section; onSite: (next: Site) => void }) {
  const [msg, setMsg] = useState("");
  const fields = section.fields as Bag;
  const look = { ...BASE, ...(fields.look as Look | undefined) };
  return (
    <div className="edits">
      <TypeRow title="Title" look={look} keys={["tlh", "tw", "ttr"]} onLook={(next) => onSite(withHero(site, section.id, { look: next }))} />
      <TypeRow title="Subtitle" look={look} keys={["slh", "sw", "str"]} onLook={(next) => onSite(withHero(site, section.id, { look: next }))} />
      <IconRow name="primaryCta" label="Primary icon" fields={fields} onPatch={(patch) => onSite(withHero(site, section.id, patch))} />
      <IconRow name="secondaryCta" label="Secondary icon" fields={fields} onPatch={(patch) => onSite(withHero(site, section.id, patch))} />
      <label className="edit">
        <span>Gradient</span>
        <select className="studio-input" aria-label="Gradient" value={String(fields.shade ?? "bottom")} onChange={(event) => onSite(withHero(site, section.id, { shade: event.target.value }))}>
          <option value="soft">Soft</option>
          <option value="bottom">Bottom</option>
          <option value="strong">Strong</option>
        </select>
      </label>
      <label className="edit">
        <span>Upload image or video</span>
        <input className="studio-input" type="file" accept="image/*,video/*" aria-label="Hero media" onChange={(event) => { const file = event.target.files?.[0]; if (file) void store(file, site, section.id, setMsg, onSite); }} />
      </label>
      {msg ? <p className="hint">{msg}</p> : null}
    </div>
  );
}

function TypeRow({ title, look, keys, onLook }: { title: string; look: Look; keys: (keyof Look)[]; onLook: (look: Look) => void }) {
  return (
    <fieldset className="nest">
      <legend>{title}</legend>
      {keys.map((key) => (
        <label className="edit" key={key}>
          <span>{key.endsWith("w") ? "Weight" : key.endsWith("tr") ? "Spacing" : "Line height"} {key.endsWith("tr") ? Number(look[key]).toFixed(2) : look[key]}</span>
          <input className="range" type="range" min={key.endsWith("w") ? 400 : key.endsWith("tr") ? -0.08 : 0.9} max={key.endsWith("w") ? 900 : key.endsWith("tr") ? 0.16 : key === "tlh" ? 1.4 : 2} step={key.endsWith("w") ? 100 : key.endsWith("tr") ? 0.01 : 0.05} aria-label={`${title} ${key.endsWith("w") ? "weight" : key.endsWith("tr") ? "spacing" : "line height"}`} value={look[key]} onChange={(event) => onLook({ ...look, [key]: Number(event.target.value) })} />
        </label>
      ))}
    </fieldset>
  );
}

function IconRow({ name, label, fields, onPatch }: { name: "primaryCta" | "secondaryCta"; label: string; fields: Bag; onPatch: (patch: Section["fields"]) => void }) {
  const cta = { ...(fields[name] as Bag) };
  const icon = typeof cta.icon === "string" ? cta.icon : "";
  return (
    <label className="edit">
      <span>{label}</span>
      <select className="studio-input" aria-label={label} value={icon} onChange={(event) => { const next = { ...cta }; if (event.target.value) next.icon = event.target.value; else delete next.icon; onPatch({ [name]: next } as Section["fields"]); }}>
        {ICONS.map((item) => <option key={item || "none"} value={item}>{NAMES[item]}</option>)}
      </select>
    </label>
  );
}

function withHero(site: Site, id: string, patch: Section["fields"]): Site {
  const next = structuredClone(site);
  const section = next.pages.flatMap((page) => page.sections).find((item) => item.id === id);
  if (section) section.fields = { ...section.fields, ...patch };
  return next;
}

async function store(file: File, site: Site, id: string, setMsg: (msg: string) => void, onSite: (next: Site) => void) {
  const next = await addHeroMedia(file, site, id);
  if (typeof next === "string") setMsg(next);
  else { setMsg(""); onSite(next); }
}
