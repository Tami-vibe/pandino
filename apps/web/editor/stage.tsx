import { useState, type CSSProperties } from "react";
import type { Site } from "@pandino/schema";
import { saveNow } from "../persistence/storage";
import { useFrame, useScale, WIDTH, type Device } from "./bridge";
import { Icon } from "./chrome";

const DEVICES: [Device, string, string][] = [
  ["desktop", "desktop_windows", "Desktop"],
  ["tablet", "tablet_mac", "Tablet"],
  ["mobile", "smartphone", "Mobile"],
];

export function Canvas({ site, hot, jump, slug, onSelect, onPage, onDownload }: {
  site: Site;
  hot: string;
  jump: number;
  slug: string;
  onSelect: (id: string, group: string) => void;
  onPage: (slug: string) => void;
  onDownload: (kind: "html" | "wordpress") => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const { stage, scale } = useScale(device);
  const frame = useFrame(site, hot, jump, slug, onSelect, onPage);
  const inner = WIDTH[device];
  const host = site.business.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) || "shop";
  return (
    <main className="canvas" style={{ "--glow": site.theme.palette.primary } as CSSProperties}>
      <Toolbar slug={host} site={site} device={device} onDevice={setDevice} onDownload={onDownload} />
      <p className="draft-bar">Draft preview. Sample photos and contact details are marked. Replace placeholder reviews, prices, and certifications before publishing.</p>
      <div className="viewport" ref={stage}>
        <div className="stage-fit" style={{ width: inner * scale }}>
          <iframe
            ref={frame}
            title="Site preview"
            src="/preview"
            style={{ width: inner, height: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: "top left" }}
            onLoad={() => frame.current?.contentWindow?.postMessage({ type: "pandino-site", site }, location.origin)}
          />
        </div>
      </div>
    </main>
  );
}

function Toolbar({ slug, site, device, onDevice, onDownload }: {
  slug: string;
  site: Site;
  device: Device;
  onDevice: (device: Device) => void;
  onDownload: (kind: "html" | "wordpress") => void;
}) {
  return (
    <div className="canvas-bar">
      <div className="url"><Icon name="lock" /><span>{slug}.pandino.site</span></div>
      <div className="devices" role="group" aria-label="Preview width">
        {DEVICES.map(([id, icon, label]) => (
          <button key={id} type="button" className={device === id ? "device on" : "device"} aria-pressed={device === id} title={label} onClick={() => onDevice(id)}>
            <Icon name={icon} /><small>{label}</small>
          </button>
        ))}
      </div>
      <div className="bar-actions">
        <button type="button" className="export-btn" title="Live preview" aria-label="Live preview" onClick={() => openLive(site)}><Icon name="open_in_new" /><span>Live</span></button>
        <button type="button" className="export-btn" title="Download HTML" onClick={() => onDownload("html")}><Icon name="html" /><span>HTML</span></button>
        <button type="button" className="export-btn" title="Download WordPress theme" onClick={() => onDownload("wordpress")}><Icon name="deployed_code" /><span>WordPress</span></button>
      </div>
    </div>
  );
}

function openLive(site: Site) {
  try { saveNow(site); } catch { /* the tab opens the last valid copy */ }
  window.open("/preview", "_blank", "noopener");
}
