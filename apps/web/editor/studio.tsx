"use client";

import { useEffect, useState } from "react";
import { validateSite, type Site } from "@pandino/schema";
import { autosaveSite, saveNow } from "../persistence/storage";
import { Rail } from "./chrome";
import { exportSite } from "./download";
import { withBrand, withBusiness, withFields, withStyle, withTheme } from "./draft";
import { focusSection, openStudioPage, sectionId } from "./focus";
import { isGroup, type RailId } from "./groups";
import { Panel } from "./panel";
import { Canvas } from "./stage";

export function Studio({ initial }: { initial: Site }) {
  const model = useStudio(initial);
  return (
    <div className="studio" data-theme={model.theme}>
      <Rail site={model.site} slug={model.slug} group={model.group} theme={model.theme} onPick={model.openGroup} onTheme={model.chooseTheme} />
      <Panel
        site={model.site} group={model.group} slug={model.slug} note={model.note} hot={model.hot}
        onFields={model.onFields} onBrand={model.onBrand} onStyle={model.onStyle} onTheme={model.onTheme} onSite={model.onSite}
        onBusiness={model.onBusiness} onSave={model.onSave}
        onPage={model.openPage} onSection={model.openSection} onPending={model.onPending}
      />
      <Canvas site={model.pending?.site ?? model.site} hot={model.hot} jump={model.jump} slug={model.pending?.slug ?? model.slug} onSelect={model.openSection} onPage={model.openPage} onDownload={model.onDownload} />
    </div>
  );
}

function useStudio(initial: Site) {
  const [site, setSite] = useState(initial);
  const [group, setGroup] = useState<RailId>("pages");
  const [slug, setSlug] = useState(initial.pages[0]?.slug ?? "/");
  const [hot, setHot] = useState("");
  const [jump, setJump] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [note, setNote] = useState("Saved");
  const [pending, setPending] = useState<Pending>(null);
  useEffect(() => { rememberTheme(setTheme); }, []);
  function commit(next: Site) {
    const parsed = validateSite(next);
    if (!parsed.success) { setNote("Could not update the preview."); return; }
    setPending(null);
    setSite(parsed.data);
    setNote("Saving…");
    autosaveSite(parsed.data, (ok) => setNote(ok ? "Saved" : "Add the missing text to save"));
  }
  const focus = (id: string) => focusSection(site, id, setHot, setSlug);
  return {
    site, group, theme, note, hot, jump, slug, pending,
    openGroup(id: RailId) { setGroup(id); focus(sectionId(site, id, slug)); setJump((n) => n + 1); },
    openSection(id: string, next: string) { if (isGroup(next)) setGroup(next); focus(id); },
    openPage(next: string) { openStudioPage(site, next, setSlug, setGroup, setHot, setJump); },
    chooseTheme() { const next = theme === "dark" ? "light" : "dark"; setTheme(next); localStorage.setItem("pandino-theme", next); },
    onFields: (id: string, fields: Site["pages"][number]["sections"][number]["fields"]) => commit(withFields(site, id, fields)),
    onBrand: (color: string) => commit(withBrand(site, color)),
    onStyle: (id: string, style: Site["pages"][number]["sections"][number]["style"]) => commit(withStyle(site, id, style)),
    onTheme: (patch: Partial<Site["theme"]>) => commit(withTheme(site, patch)),
    onSite: commit,
    onPending: (next: Site | null, slug?: string) => keepPending(next, slug ?? "", setPending, setNote),
    onBusiness: (business: Site["business"]) => commit(withBusiness(site, business)),
    onSave() { try { saveNow(site); setNote("Saved"); } catch { setNote("Add the missing text to save"); } },
    onDownload: (kind: "html" | "wordpress") => void exportSite(kind, site, setNote),
  };
}

type Pending = { site: Site; slug: string } | null;

function keepPending(next: Site | null, slug: string, setPending: (value: Pending) => void, setNote: (value: string) => void) {
  if (!next) { setPending(null); return; }
  const parsed = validateSite(next);
  if (!parsed.success) { setPending(null); setNote("Could not update the preview."); return; }
  setPending({ site: parsed.data, slug });
}

function rememberTheme(setTheme: (theme: "light" | "dark") => void) {
  const next = localStorage.getItem("pandino-theme") === "light" ? "light" : "dark";
  setTheme(next);
  localStorage.setItem("pandino-theme", next);
}
