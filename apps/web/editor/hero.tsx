"use client";

import type { Site } from "@pandino/schema";

type Section = Site["pages"][number]["sections"][number];
type Bag = Record<string, unknown>;
const ICONS = ["", "call", "calendar_month", "arrow_forward", "mail", "directions_car"];
const NAMES: Record<string, string> = { "": "None", call: "Call", calendar_month: "Calendar", arrow_forward: "Arrow", mail: "Mail", directions_car: "Car" };

export function HeroWords({ site, section, onSite }: { site: Site; section: Section; onSite: (next: Site) => void }) {
  const fields = section.fields as Bag;
  const patch = (next: Section["fields"]) => onSite(withHero(site, section.id, next));
  return (
    <div className="edits">
      <IconRow name="primaryCta" label="Primary icon" fields={fields} onPatch={patch} />
      <IconRow name="secondaryCta" label="Secondary icon" fields={fields} onPatch={patch} />
    </div>
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

export function withHero(site: Site, id: string, patch: Section["fields"]): Site {
  const next = structuredClone(site);
  const section = next.pages.flatMap((page) => page.sections).find((item) => item.id === id);
  if (section) section.fields = { ...section.fields, ...patch };
  return next;
}
