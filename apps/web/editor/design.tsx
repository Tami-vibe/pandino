import { useEffect, useState } from "react";
import type { Site } from "@pandino/schema";

type Style = Site["pages"][number]["sections"][number]["style"];
type ThemePatch = { stickyHeader?: boolean; typeScale?: number };

export function StyleFields({ site, onBrand, onTheme }: {
  site: Site;
  onBrand: (color: string) => void;
  onTheme: (patch: ThemePatch) => void;
}) {
  const [hex, setHex] = useState(site.theme.brandColor);
  useEffect(() => { setHex(site.theme.brandColor); }, [site.theme.brandColor]);
  function apply(value: string) {
    const next = value.toUpperCase();
    setHex(next);
    if (/^#[0-9A-Fa-f]{6}$/.test(next)) onBrand(next);
  }
  return (
    <div className="edits">
      <label className="edit">
        <span>Brand color</span>
        <span className="color-row">
          <input type="color" aria-label="Brand color" value={/^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : site.theme.brandColor} onChange={(event) => apply(event.target.value)} />
          <input className="studio-input" aria-label="Brand color hex" value={hex} onChange={(event) => apply(event.target.value)} />
        </span>
      </label>
      <label className="check-row">
        <input type="checkbox" checked={site.theme.stickyHeader} onChange={(event) => onTheme({ stickyHeader: event.target.checked })} />
        Sticky header
      </label>
      <label className="edit">
        <span>Type scale {site.theme.typeScale.toFixed(2)}</span>
        <input className="range" type="range" min="0.85" max="1.25" step="0.05" value={site.theme.typeScale} aria-label="Type scale" onChange={(event) => onTheme({ typeScale: Number(event.target.value) })} />
      </label>
      <p className="hint">{site.theme.fonts.heading} and {site.theme.fonts.body}. Eyebrow, heading, subhead, body, and small type follow this scale.</p>
    </div>
  );
}

export function SectionLook({ style, onStyle }: { style: Style; onStyle: (style: Style) => void }) {
  const mode = style.background === "none" || style.background === "image" ? style.background : "tint";
  return (
    <div className="edits look">
      <label className="edit">
        <span>Background</span>
        <select className="studio-input" aria-label="Background" value={mode} onChange={(event) => onStyle({ ...style, background: event.target.value })}>
          <option value="none">None</option>
          <option value="tint">Tint</option>
          <option value="image">Image</option>
        </select>
      </label>
      <label className="edit">
        <span>Overlay {Math.round(style.overlay * 100)}%</span>
        <input className="range" type="range" min="0" max="1" step="0.05" value={style.overlay} aria-label="Overlay opacity" onChange={(event) => onStyle({ ...style, overlay: Number(event.target.value) })} />
      </label>
    </div>
  );
}
