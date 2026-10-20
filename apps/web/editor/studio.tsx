"use client";

import { useEffect, useState } from "react";
import type { Site } from "@pandino/schema";
import { autosaveSite, saveNow } from "../persistence/storage";
import { Rail } from "./chrome";
import { exportSite } from "./download";
import { withBrand, withBusiness, withFields, withMeta, withOrder, withStyle, withTheme } from "./draft";
import type { ThemePatch } from "./design";
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
        onFields={model.onFields} onBrand={model.onBrand} onStyle={model.onStyle} onTheme={model.onTheme}
        onBusiness={model.onBusiness} onTitle={model.onTitle} onSave={model.onSave}
        onPage={model.openPage} onSection={model.openSection} onOrder={model.onOrder}
      />
      <Canvas site={model.site} hot={model.hot} jump={model.jump} slug={model.slug} onSelect={model.openSection} onPage={model.openPage} onDownload={model.onDownload} />
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
  useEffect(() => { rememberTheme(setTheme); }, []);
  function commit(next: Site) {
    setSite(next);
    setNote("Saving…");
    autosaveSite(next, (ok) => setNote(ok ? "Saved" : "Add the missing text to save"));
  }
  const focus = (id: string) => focusSection(site, id, setHot, setSlug);
  return {
    site, group, theme, note, hot, jump, slug,
    openGroup(id: RailId) { setGroup(id); focus(sectionId(site, id, slug)); setJump((n) => n + 1); },
    openSection(id: string, next: string) { if (isGroup(next)) setGroup(next); focus(id); },
    openPage(next: string) { openStudioPage(site, next, setSlug, setGroup, setHot, setJump); },
    chooseTheme() {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("pandino-theme", next);
    },
    onFields: (id: string, fields: Site["pages"][number]["sections"][number]["fields"]) => commit(withFields(site, id, fields)),
    onBrand: (color: string) => commit(withBrand(site, color)),
    onStyle: (id: string, style: Site["pages"][number]["sections"][number]["style"]) => commit(withStyle(site, id, style)),
    onTheme: (patch: ThemePatch) => commit(withTheme(site, patch)),
    onOrder: (from: number, to: number) => commit(withOrder(site, slug, from, to)),
    onBusiness: (business: Site["business"]) => commit(withBusiness(site, business)),
    onTitle: (title: string) => commit(withMeta(site, title, site.business.name)),
    onSave() { try { saveNow(site); setNote("Saved"); } catch { setNote("Add the missing text to save"); } },
    onDownload: (kind: "html" | "wordpress") => void exportSite(kind, site, setNote),
  };
}

function rememberTheme(setTheme: (theme: "light" | "dark") => void) {
  const saved = localStorage.getItem("pandino-theme");
  const next = saved === "light" || saved === "dark" ? saved : "dark";
  setTheme(next);
  localStorage.setItem("pandino-theme", next);
}
