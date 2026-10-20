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

const MOCK: Record<string, string> = {
  ast_hero: "/media/hero/hero-1.jpg",
  ast_before: "/media/hero/before.jpg",
  ast_after: "/media/hero/after.jpg",
  ast_shop: "/media/showcase/workshop-bay.jpg",
};

export function photo(site: Site, assetId?: string) {
  const asset = assetId ? site.assets[assetId] : undefined;
  if (!asset || asset.source === "owner") return asset;
  const src = assetId ? MOCK[assetId] : undefined;
  if (src && asset.source !== "library") return { ...asset, src };
  return asset.source === "placeholder" ? undefined : asset;
}

export function anyPhoto(site: Site) {
  const hit = Object.entries(site.assets).find(([, asset]) => asset.source !== "placeholder");
  return hit ? photo(site, hit[0])?.src : undefined;
}

export function toneOf(style: { background: string; overlay: number } | undefined, image?: string) {
  const asked = style?.background === "image" ? "image" : style?.background === "none" ? "none" : "tint";
  const mode = asked === "image" && image ? "image" : asked === "none" ? "none" : "tint";
  const css = mode === "image" ? { backgroundImage: `url("${image}")`, "--overlay": String(style?.overlay ?? 0) } : undefined;
  return { mode, css: css as CSSProperties | undefined };
}
