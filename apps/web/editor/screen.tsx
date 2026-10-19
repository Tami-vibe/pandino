"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Site } from "@pandino/schema";
import { autosaveSite, loadSite, saveNow } from "../persistence/storage";
import "../app/editor.css";
import { Canvas, Rail } from "./chrome";
import { withBrand, withBusiness, withFields, withMeta } from "./draft";
import { type RailId } from "./groups";
import { Panel } from "./panel";

export function Editor() {
  const [site, setSite] = useState<Site | null | undefined>(undefined);
  useEffect(() => { setSite(loadSite()); }, []);
  if (site === undefined) return <main className="studio" data-theme="light" />;
  if (!site) return <Empty />;
  return <Studio initial={site} />;
}

function Empty() {
  return (
    <main className="studio empty-wrap" data-theme="light">
      <div className="empty">
        <h1>No site yet</h1>
        <p>Generate a site and it stays in this browser.</p>
        <Link href="/">Back to the prompt</Link>
      </div>
    </main>
  );
}

function Studio({ initial }: { initial: Site }) {
  const [site, setSite] = useState(initial);
  const [group, setGroup] = useState<RailId>("pages");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [note, setNote] = useState("Saved");
  useEffect(() => {
    const saved = localStorage.getItem("pandino-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
    else if (matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);

  function commit(next: Site) {
    setSite(next);
    setNote("Saving…");
    autosaveSite(next, (ok) => setNote(ok ? "Saved" : "Add the missing text to save"));
  }

  function chooseTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("pandino-theme", next);
  }

  return (
    <div className="studio" data-theme={theme}>
      <Rail site={site} group={group} theme={theme} onPick={setGroup} onTheme={chooseTheme} />
      <Panel
        site={site} group={group} note={note}
        onFields={(id, fields) => commit(withFields(site, id, fields))}
        onBrand={(color) => commit(withBrand(site, color))}
        onBusiness={(business) => commit(withBusiness(site, business))}
        onTitle={(title) => commit(withMeta(site, title, site.business.name))}
        onSave={() => { try { saveNow(site); setNote("Saved"); } catch { setNote("Add the missing text to save"); } }}
      />
      <Canvas site={site} onDownload={(kind) => void exportSite(kind, site, setNote)} />
    </div>
  );
}

async function exportSite(kind: "html" | "wordpress", site: Site, setNote: (value: string) => void) {
  setNote("Preparing download…");
  try {
    const response = await fetch(`/api/export?kind=${kind}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(site) });
    if (!response.ok) throw new Error("export failed");
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = kind === "html" ? "index.html" : "pandino-theme.zip";
    link.click();
    URL.revokeObjectURL(url);
    setNote("Saved");
  } catch {
    setNote("Could not export.");
  }
}
