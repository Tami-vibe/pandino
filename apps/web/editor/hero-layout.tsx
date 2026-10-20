"use client";
import { useState } from "react";
import type { Site } from "@pandino/schema";
import { Columns, FilePick, Pick, Range, TypeRow, type Look } from "../../../packages/recipes/src/sections/hero-form";
import { SectionLook } from "./design";
import { withHero } from "./hero";
import { addHeroMedia } from "./upload";

type Section = Site["pages"][number]["sections"][number];
type Bag = Record<string, unknown>;
const BASE: Look = { tlh: 1.05, tw: 800, ttr: -0.03, slh: 1.5, sw: 400, str: 0, sz: 1 };

export function HeroLayout({ site, section, onSite, onStyle }: { site: Site; section: Section; onSite: (next: Site) => void; onStyle: (style: Section["style"]) => void }) {
  const [msg, setMsg] = useState("");
  const fields = section.fields as Bag;
  const look = { ...BASE, ...(fields.look as Look | undefined) };
  const count = Number(fields.columns ?? "1");
  const patch = (next: Section["fields"]) => onSite(withHero(site, section.id, next));
  const save = (file: File, column?: number) => void keep(file, site, section.id, column, setMsg, onSite);
  const setCol = (index: number, col: Bag) => {
    const cols = [...(Array.isArray(fields.cols) ? fields.cols as Bag[] : [])];
    cols[index] = { ...(cols[index] as Bag | undefined), ...col };
    patch({ cols } as Section["fields"]);
  };
  return (
    <div className="edits">
      <Range label={`Text size ${Number(look.sz).toFixed(2)}`} aria="Hero text size" min={0.85} max={1.45} step={0.01} value={Number(look.sz)} onChange={(sz) => patch({ look: { ...look, sz } })} />
      <TypeRow title="Title" look={look} keys={["tlh", "tw", "ttr"]} onLook={(next) => patch({ look: next })} />
      <TypeRow title="Subtitle" look={look} keys={["slh", "sw", "str"]} onLook={(next) => patch({ look: next })} />
      <Pick label="Gradient" aria="Gradient" value={String(fields.shade ?? "bottom")} options={[["soft", "Soft"], ["bottom", "Bottom"], ["strong", "Strong"]]} onChange={(shade) => patch({ shade })} />
      <SectionLook style={section.style} onStyle={onStyle} />
      <Pick label="Place the words" aria="Place the words" value={String(fields.align ?? "center")} options={[["left", "Left"], ["center", "Center"], ["right", "Right"]]} onChange={(align) => patch({ align })} />
      <Pick label="Columns" aria="Columns" value={String(fields.columns ?? "1")} options={[["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]]} onChange={(columns) => patch({ columns })} />
      {count > 1 ? <Columns count={count} cols={fields.cols} locale={site.locales.default} onPatch={setCol} onFile={save} /> : <FilePick label="Upload image or video" aria="Hero media" onFile={save} />}
      {msg ? <p className="hint">{msg}</p> : null}
    </div>
  );
}

async function keep(file: File, site: Site, id: string, column: number | undefined, setMsg: (msg: string) => void, onSite: (next: Site) => void) {
  const next = await addHeroMedia(file, site, id, column);
  if (typeof next === "string") setMsg(next); else { setMsg(""); onSite(next); }
}
