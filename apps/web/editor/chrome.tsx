import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { Site } from "@pandino/schema";
import { GROUPS, type RailId } from "./groups";

const DEVICES = [
  ["desktop", "1280px", "Desktop"],
  ["tablet", "768px", "Tablet"],
  ["mobile", "375px", "Mobile"],
] as const;

export function Icon({ name, fill = false }: { name: string; fill?: boolean }) {
  return <span className={fill ? "ms fill" : "ms"} aria-hidden="true">{name}</span>;
}

export function Rail({ site, group, theme, onPick, onTheme }: {
  site: Site;
  group: RailId;
  theme: "light" | "dark";
  onPick: (id: RailId) => void;
  onTheme: () => void;
}) {
  const sections = site.pages[0]?.sections ?? [];
  return (
    <nav className="rail" aria-label="Builder sections">
      <Link className="rail-logo" href="/" aria-label="Pandino home">🐼</Link>
      <div className="rail-items">
        {GROUPS.map((item) => {
          const count = item.id === "pages" || item.id === "style" ? 0 : sections.filter((section) => section.group === item.id).length;
          const on = item.id === group;
          return (
            <button key={item.id} type="button" className={on ? "rail-btn on" : "rail-btn"} aria-current={on ? "true" : undefined} onClick={() => onPick(item.id)}>
              <Icon name={item.icon} />
              <small>{item.label}</small>
              {count > 0 ? <span className="dot">{count}</span> : null}
            </button>
          );
        })}
      </div>
      <div className="rail-foot">
        <button type="button" className="rail-btn" onClick={onTheme} aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}>
          <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} />
          <small>Theme</small>
        </button>
      </div>
    </nav>
  );
}

export function Canvas({ site, onDownload }: { site: Site; onDownload: (kind: "html" | "wordpress") => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<(typeof DEVICES)[number][0]>("desktop");
  const slug = site.business.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) || "shop";
  const width = DEVICES.find((item) => item[0] === device)?.[1] ?? "1280px";
  useEffect(() => {
    const post = () => frame.current?.contentWindow?.postMessage(site, location.origin);
    post();
    function ready(event: MessageEvent) {
      if (event.origin === location.origin && event.data === "pandino-preview-ready") post();
    }
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [site]);
  return (
    <main className="canvas" style={{ "--glow": site.theme.palette.primary } as CSSProperties}>
      <div className="canvas-bar">
        <div className="url"><Icon name="lock" /><span>{slug}.pandino.site</span></div>
        <div className="devices" role="group" aria-label="Preview width">
          {DEVICES.map(([id, , label]) => (
            <button key={id} type="button" className={device === id ? "device on" : "device"} aria-pressed={device === id} onClick={() => setDevice(id)}>{label}</button>
          ))}
        </div>
        <div className="bar-actions">
          <button type="button" className="export-btn" onClick={() => onDownload("html")}>Download HTML</button>
          <button type="button" className="export-btn" onClick={() => onDownload("wordpress")}>Download WordPress theme</button>
        </div>
      </div>
      <p className="draft-bar">Draft preview. Replace the placeholder reviews, prices, photos, certifications, and phone number before publishing.</p>
      <div className="viewport">
        <iframe ref={frame} title="Site preview" src="/preview" style={{ width }} onLoad={() => frame.current?.contentWindow?.postMessage(site, location.origin)} />
      </div>
    </main>
  );
}
