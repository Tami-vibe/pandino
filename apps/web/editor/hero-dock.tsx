"use client";

import { useState } from "react";
import type { Site } from "@pandino/schema";
import { TextFields } from "./fields";
import { HeroLayout } from "./hero-layout";
import { HeroWords } from "./hero";

type Section = Site["pages"][number]["sections"][number];

export function HeroDock({ site, section, onSite, onStyle, onFields }: {
  site: Site;
  section: Section;
  onSite: (next: Site) => void;
  onStyle: (style: Section["style"]) => void;
  onFields: (fields: Section["fields"]) => void;
}) {
  const [door, setDoor] = useState("words");
  return (
    <div className="edits">
      <div className="tabs tabs-box" role="tablist" aria-label="Hero">
        <button type="button" role="tab" className={door === "words" ? "tab tab-active" : "tab"} aria-selected={door === "words"} onClick={() => setDoor("words")}>Words</button>
        <button type="button" role="tab" className={door === "layout" ? "tab tab-active" : "tab"} aria-selected={door === "layout"} onClick={() => setDoor("layout")}>Layout</button>
      </div>
      {door === "words" ? <TextFields value={section.fields} locale={site.locales.default} onChange={(fields) => onFields(fields as Section["fields"])} /> : null}
      {door === "words" ? <HeroWords site={site} section={section} onSite={onSite} /> : null}
      {door === "layout" ? <HeroLayout site={site} section={section} onSite={onSite} onStyle={onStyle} /> : null}
    </div>
  );
}
