"use client";

import { useEffect, useState } from "react";
import type { Site } from "@pandino/schema";
import { autosaveSite, saveNow } from "../persistence/storage";
import { Rail } from "./chrome";
import { exportSite } from "./download";
import { withBrand, withBusiness, withFields, withMeta, withStyle, withTheme } from "./draft";
import { isGroup, type RailId } from "./groups";
import { Panel } from "./panel";
import { Canvas } from "./stage";

export function Studio({ initial }: { initial: Site }) {
  const model = useStudio(initial);
  return (
    <div className="studio" data-theme={model.theme}>
      <Rail site={model.site} group={model.group} theme={model.theme} onPick={model.openGroup} onTheme={model.chooseTheme} />
      <Panel
        site={model.site} group={model.group} note={model.note} hot={model.hot}
        onFields={model.onFields} onBrand={model.onBrand} onStyle={model.onStyle} onTheme={model.onTheme}
        onBusiness={model.onBusiness} onTitle={model.onTitle} onSave={model.onSave}
      />
      <Canvas site={model.site} hot={model.hot} jump={model.jump} onSelect={model.openSection} onDownload={model.onDownload} />
    </div>
  );
}

function useStudio(initial: Site) {
  const [site, setSite] = useState(initial);
  const [group, setGroup] = useState<RailId>("pages");
  const [hot, setHot] = useState("");
  const [jump, setJump] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [note, setNote] = useState("Saved");
  useEffect(() => { rememberTheme(setTheme); }, []);
  function commit(next: Site) {
    setSite(next);
    setNote("Saving…");
    autosaveSite(next, (ok) => setNote(ok ? "Saved" : "Add the missing text to save"));
  }
  return {
    site, group, theme, note, hot, jump,
    openGroup(id: RailId) { setGroup(id); setHot(sectionId(site, id)); setJump((n) => n + 1); },
    openSection(id: string, next: string) { if (isGroup(next)) setGroup(next); setHot(id); },
    chooseTheme() {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("pandino-theme", next);
    },
    onFields: (id: string, fields: Site["pages"][number]["sections"][number]["fields"]) => commit(withFields(site, id, fields)),
    onBrand: (color: string) => commit(withBrand(site, color)),
    onStyle: (id: string, style: Site["pages"][number]["sections"][number]["style"]) => commit(withStyle(site, id, style)),
    onTheme: (patch: { stickyHeader?: boolean; typeScale?: number }) => commit(withTheme(site, patch)),
    onBusiness: (business: Site["business"]) => commit(withBusiness(site, business)),
    onTitle: (title: string) => commit(withMeta(site, title, site.business.name)),
    onSave() { try { saveNow(site); setNote("Saved"); } catch { setNote("Add the missing text to save"); } },
    onDownload: (kind: "html" | "wordpress") => void exportSite(kind, site, setNote),
  };
}

function sectionId(site: Site, group: string) {
  return site.pages.flatMap((page) => page.sections).find((section) => section.group === group)?.id ?? "";
}

function rememberTheme(setTheme: (theme: "light" | "dark") => void) {
  const saved = localStorage.getItem("pandino-theme");
  if (saved === "light" || saved === "dark") setTheme(saved);
  else if (matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
}
