import type { CSSProperties } from "react";
import type { Site } from "@pandino/schema";

export function Mark({ name }: { name: string }) {
  return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>;
}

export function Shot({ label, src, alt }: { label: string; src?: string; alt?: string }) {
  if (!src) {
    return (
      <div className="frame" role="img" aria-label={label}>
        <span>{label}</span>
      </div>
    );
  }
  return <img className="shot" src={src} alt={alt || label} />;
}

export function photo(site: Site, assetId?: string) {
  const asset = assetId ? site.assets[assetId] : undefined;
  if (!asset || asset.source === "placeholder") return undefined;
  return asset;
}

export function anyPhoto(site: Site) {
  return Object.values(site.assets).find((asset) => asset.source !== "placeholder")?.src;
}

export function toneOf(style: { background: string; overlay: number } | undefined, image?: string) {
  const asked = style?.background === "image" ? "image" : style?.background === "none" ? "none" : "tint";
  const mode = asked === "image" && image ? "image" : asked === "none" ? "none" : "tint";
  const css = mode === "image" ? { backgroundImage: `url("${image}")`, "--overlay": String(style?.overlay ?? 0) } : undefined;
  return { mode, css: css as CSSProperties | undefined };
}
