import { useEffect, useState } from "react";
import type { Site } from "@pandino/schema";

type Style = Site["pages"][number]["sections"][number]["style"];
export type ThemePatch = Partial<Pick<Site["theme"], "stickyHeader" | "typeScale" | "fonts" | "radius" | "header" | "footer" | "border" | "social" | "stickyFoot">>;

const PAIRS = ["Syne/Manrope=Syne and Manrope", "Barlow Condensed/Inter=Barlow Condensed and Inter", "Montserrat/Inter=Montserrat and Inter", "Poppins/Poppins=Poppins", "DM Serif Display/Manrope=DM Serif Display and Manrope", "Playfair Display/Inter=Playfair Display and Inter"];

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
      <Pick label="Fonts" value={`${site.theme.fonts.heading}/${site.theme.fonts.body}`} options={PAIRS} onPick={(value) => onTheme({ fonts: { heading: value.split("/")[0] || "Syne", body: value.split("/")[1] || "Manrope" } })} />
      <Pick label="Header" value={site.theme.header} options={["bar=Bar", "center=Centered"]} onPick={(header) => onTheme({ header: header as Site["theme"]["header"] })} />
      <Pick label="Footer" value={site.theme.footer} options={["columns=Columns", "stack=Stacked"]} onPick={(footer) => onTheme({ footer: footer as Site["theme"]["footer"] })} />
      <Pick label="Social icons" value={site.theme.social} options={["left=Left", "center=Center", "right=Right"]} onPick={(social) => onTheme({ social: social as Site["theme"]["social"] })} />
      <Pick label="Outline" value={String(site.theme.border)} options={["1=1 px", "2=2 px", "3=3 px"]} onPick={(border) => onTheme({ border: Number(border) })} />
      <Pick label="Radius" value={site.theme.radius} options={["sm=Small", "md=Medium", "lg=Large"]} onPick={(radius) => onTheme({ radius })} />
      <label className="check-row">
        <input type="checkbox" checked={site.theme.stickyHeader} onChange={(event) => onTheme({ stickyHeader: event.target.checked })} />
        Sticky header
      </label>
      <label className="check-row">
        <input type="checkbox" checked={site.theme.stickyFoot} onChange={(event) => onTheme({ stickyFoot: event.target.checked })} />
        Sticky footer bar
      </label>
      <label className="edit">
        <span>Type scale {site.theme.typeScale.toFixed(2)}</span>
        <input className="range" type="range" min="0.85" max="1.25" step="0.05" value={site.theme.typeScale} aria-label="Type scale" onChange={(event) => onTheme({ typeScale: Number(event.target.value) })} />
      </label>
      <p className="hint">Fonts, color, header, footer, outline, and radius apply to every section.</p>
    </div>
  );
}

function Pick({ label, value, options, onPick }: { label: string; value: string; options: string[]; onPick: (value: string) => void }) {
  return (
    <label className="edit">
      <span>{label}</span>
      <select className="studio-input" aria-label={label} value={value} onChange={(event) => onPick(event.target.value)}>
        {options.map((item) => {
          const [id, name] = item.split("=");
          return <option key={id} value={id}>{name ?? id}</option>;
        })}
      </select>
    </label>
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
