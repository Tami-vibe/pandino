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

export function useFrame(site: Site, hot: string, jump: number, onSelect: (id: string, group: string) => void) {
  const frame = useRef<HTMLIFrameElement>(null);
  const select = useRef(onSelect);
  const hotNow = useRef(hot);
  select.current = onSelect;
  hotNow.current = hot;
  useEffect(() => {
    const postSite = () => frame.current?.contentWindow?.postMessage({ type: "pandino-site", site }, location.origin);
    postSite();
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin) return;
      if (event.data === "pandino-preview-ready") {
        postSite();
        const id = hotNow.current;
        if (id) frame.current?.contentWindow?.postMessage({ type: "pandino-highlight", id }, location.origin);
      }
      const data = event.data as { type?: string; id?: string; group?: string } | null;
      if (data && typeof data === "object" && data.type === "pandino-select" && data.id && data.group) select.current(data.id, data.group);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [site]);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: "pandino-highlight", id: hot }, location.origin);
  }, [hot, jump]);
  return frame;
}
