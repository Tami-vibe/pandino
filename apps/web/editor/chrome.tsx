import type { CSSProperties } from "react";
import Link from "next/link";
import type { Site } from "@pandino/schema";
import { SitePage } from "@pandino/renderer";
import { GROUPS, type RailId } from "./groups";

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
  const slug = site.business.name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) || "shop";
  return (
    <main className="canvas" style={{ "--glow": site.theme.palette.primary } as CSSProperties}>
      <div className="canvas-bar">
        <div className="url"><Icon name="lock" /><span>{slug}.pandino.site</span></div>
        <div className="bar-actions">
          <button type="button" className="export-btn" onClick={() => onDownload("html")}>Download HTML</button>
          <button type="button" className="export-btn" onClick={() => onDownload("wordpress")}>Download WordPress theme</button>
        </div>
      </div>
      <p className="draft-bar">Draft preview. Replace the placeholder reviews, prices, photos, certifications, and phone number before publishing.</p>
      <div className="viewport"><SitePage site={site} /></div>
    </main>
  );
}
