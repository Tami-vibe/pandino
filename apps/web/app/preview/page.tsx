"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { validateSite, type Site } from "@pandino/schema";
import { SitePage } from "@pandino/renderer";
import { loadSite } from "../../persistence/storage";

export default function PreviewPage() {
  const root = useRef<HTMLDivElement>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [spot, setSpot] = useState({ id: "", tick: 0 });
  useEffect(() => {
    setSite(loadSite());
    if (window.parent === window) return undefined;
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin || !event.data || typeof event.data !== "object") return;
      const data = event.data as { type?: string; site?: unknown; id?: string };
      if (data.type === "pandino-site") {
        const parsed = validateSite(data.site);
        if (parsed.success) setSite(parsed.data);
      }
      if (data.type === "pandino-highlight") setSpot((prev) => ({ id: data.id ?? "", tick: prev.tick + 1 }));
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage("pandino-preview-ready", location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node || window.parent === window) return;
    node.classList.add("builder");
    paintTags(node);
    node.querySelectorAll(".is-hot").forEach((item) => item.classList.remove("is-hot"));
    if (spot.id) document.getElementById(spot.id)?.classList.add("is-hot");
  }, [site, spot.id]);
  useEffect(() => {
    if (!spot.id || window.parent === window) return;
    document.getElementById(spot.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [spot.tick]);
  if (!site) return null;
  return (
    <div ref={root} onClick={(event) => choose(event, setSpot)}>
      <SitePage site={site} />
    </div>
  );
}

function paintTags(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("section[data-label]").forEach((section) => {
    let tag = section.querySelector<HTMLElement>(":scope > .section-tag");
    if (!tag) {
      tag = document.createElement("span");
      tag.className = "section-tag";
      tag.setAttribute("aria-hidden", "true");
      section.prepend(tag);
    }
    const name = document.createElement("span");
    name.textContent = section.dataset.label ?? "";
    if (!section.dataset.icon) {
      tag.replaceChildren(name);
      return;
    }
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = section.dataset.icon;
    tag.replaceChildren(icon, name);
  });
}

function choose(event: MouseEvent, setSpot: (value: { id: string; tick: number } | ((prev: { id: string; tick: number }) => { id: string; tick: number })) => void) {
  if (window.parent === window) return;
  const node = (event.target as HTMLElement).closest<HTMLElement>("[data-group]");
  if (!node?.id || !node.dataset.group) return;
  setSpot((prev) => ({ id: node.id, tick: prev.tick + 1 }));
  window.parent.postMessage({ type: "pandino-select", id: node.id, group: node.dataset.group }, location.origin);
}
