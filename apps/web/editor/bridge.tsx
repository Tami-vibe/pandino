import { useEffect, useRef, useState } from "react";
import type { Site } from "@pandino/schema";

const WIDTH = { desktop: 1280, tablet: 768, mobile: 375 } as const;
export type Device = keyof typeof WIDTH;
export { WIDTH };

export function useScale(device: Device) {
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const node = stage.current;
    if (!node) return undefined;
    const watch = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      const next = device === "mobile" ? Math.min(1, width / WIDTH[device]) : width / WIDTH[device];
      setScale(next > 0 && Number.isFinite(next) ? next : 1);
    });
    watch.observe(node);
    return () => watch.disconnect();
  }, [device]);
  return { stage, scale };
}

export function useFrame(site: Site, hot: string, jump: number, slug: string, onSelect: (id: string, group: string) => void, onPage: (slug: string) => void) {
  const frame = useRef<HTMLIFrameElement>(null);
  const select = useRef(onSelect);
  const page = useRef(onPage);
  const hotNow = useRef(hot);
  const slugNow = useRef(slug);
  select.current = onSelect;
  page.current = onPage;
  hotNow.current = hot;
  slugNow.current = slug;
  useEffect(() => {
    const postSite = () => frame.current?.contentWindow?.postMessage({ type: "pandino-site", site }, location.origin);
    postSite();
    function onMessage(event: MessageEvent) { hearFrame(event, frame.current, postSite, select, page, hotNow, slugNow); }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [site]);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: "pandino-highlight", id: hot }, location.origin);
  }, [hot, jump]);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: "pandino-page", slug }, location.origin);
  }, [slug]);
  return frame;
}

function hearFrame(event: MessageEvent, frame: HTMLIFrameElement | null, postSite: () => void, select: { current: (id: string, group: string) => void }, page: { current: (slug: string) => void }, hotNow: { current: string }, slugNow: { current: string }) {
  if (event.origin !== location.origin) return;
  if (event.data === "pandino-preview-ready") {
    postSite();
    frame?.contentWindow?.postMessage({ type: "pandino-page", slug: slugNow.current }, location.origin);
    if (hotNow.current) frame?.contentWindow?.postMessage({ type: "pandino-highlight", id: hotNow.current }, location.origin);
  }
  const data = event.data as { type?: string; id?: string; group?: string; slug?: string } | null;
  if (!data || typeof data !== "object") return;
  if (data.type === "pandino-select" && data.id && data.group) select.current(data.id, data.group);
  if (data.type === "pandino-page" && data.slug) page.current(data.slug);
}
