"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { validateSite, type Site } from "@pandino/schema";
import { SitePage } from "@pandino/renderer";
import { loadSite } from "../../persistence/storage";

export default function PreviewPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [spot, setSpot] = useState({ id: "", tick: 0 });
  useEffect(() => {
    setSite(loadSite());
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin || !event.data || typeof event.data !== "object") return;
      const data = event.data as { type?: string; site?: unknown; id?: string };
      if (data.type === "pandino-site") {
        const parsed = validateSite(data.site);
        if (parsed.success) setSite(parsed.data);
      }
      if (data.type === "pandino-highlight") {
        setSpot((prev) => ({ id: data.id ?? "", tick: prev.tick + 1 }));
      }
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage("pandino-preview-ready", location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  useEffect(() => {
    document.querySelectorAll(".is-hot").forEach((node) => node.classList.remove("is-hot"));
    if (spot.id) document.getElementById(spot.id)?.classList.add("is-hot");
  }, [spot.id, site]);
  useEffect(() => {
    if (!spot.id) return;
    document.getElementById(spot.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [spot.tick]);
  if (!site) return null;
  return (
    <div className="builder" onClick={(event) => choose(event, setSpot)}>
      <SitePage site={site} />
    </div>
  );
}

function choose(event: MouseEvent, setSpot: (value: { id: string; tick: number } | ((prev: { id: string; tick: number }) => { id: string; tick: number })) => void) {
  const node = (event.target as HTMLElement).closest<HTMLElement>("[data-group]");
  if (!node?.id || !node.dataset.group) return;
  setSpot((prev) => ({ id: node.id, tick: prev.tick + 1 }));
  window.parent.postMessage({ type: "pandino-select", id: node.id, group: node.dataset.group }, location.origin);
}
