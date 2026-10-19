"use client";

import { useEffect, useRef, useState } from "react";
import { validateSite, type Site } from "@pandino/schema";
import { SitePage } from "@pandino/renderer";
import { loadSite } from "../../persistence/storage";
import { onPreviewClick, paintTags } from "./tags";

export default function PreviewPage() {
  const root = useRef<HTMLDivElement>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [slug, setSlug] = useState("/");
  const [spot, setSpot] = useState({ id: "", tick: 0 });
  useEffect(() => {
    setSite(loadSite());
    const saved = localStorage.getItem("pandino-cookie");
    if (saved) document.documentElement.dataset.cookie = saved;
    if (window.parent === window) return undefined;
    function onMessage(event: MessageEvent) { applyMessage(event, setSite, setSlug, setSpot); }
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
  }, [site, slug, spot.id]);
  useEffect(() => {
    if (!spot.id || window.parent === window) return;
    document.getElementById(spot.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [spot.tick]);
  if (!site) return null;
  const page = site.pages.some((item) => item.slug === slug) ? slug : site.pages[0]?.slug;
  return (
    <div ref={root} onClick={(event) => onPreviewClick(event, setSlug, setSpot)}>
      <SitePage site={site} slug={page} links="file" />
    </div>
  );
}

function applyMessage(event: MessageEvent, setSite: (site: Site) => void, setSlug: (slug: string) => void, setSpot: (value: (prev: { id: string; tick: number }) => { id: string; tick: number }) => void) {
  if (event.origin !== location.origin || !event.data || typeof event.data !== "object") return;
  const data = event.data as { type?: string; site?: unknown; id?: string; slug?: string };
  if (data.type === "pandino-site") {
    const parsed = validateSite(data.site);
    if (parsed.success) setSite(parsed.data);
  }
  if (data.type === "pandino-highlight") setSpot((prev) => ({ id: data.id ?? "", tick: prev.tick + 1 }));
  if (data.type === "pandino-page" && data.slug) setSlug(data.slug);
}
