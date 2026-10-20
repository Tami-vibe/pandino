import type { Site } from "@pandino/schema";

type Bag = Record<string, unknown>;
const MAX_VIDEO = 2_000_000;

export async function addHeroMedia(file: File, site: Site, id: string): Promise<Site | string> {
  const video = file.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(file.name);
  if (video && file.size > MAX_VIDEO) return "Video must be under 2MB";
  try {
    const media = video ? await videoUrl(file) : await jpeg(file);
    return place(site, id, media);
  } catch {
    return "Could not read that file";
  }
}

function place(site: Site, id: string, media: { type: "image" | "video"; src: string; width: number; height: number }) {
  const assetId = `upl_${Date.now().toString(36)}`;
  const next = structuredClone(site);
  next.assets[assetId] = {
    type: media.type,
    src: media.src,
    alt: { [site.locales.default]: "Uploaded hero media" },
    source: "owner",
    width: media.width,
    height: media.height,
  };
  const section = next.pages.flatMap((page) => page.sections).find((item) => item.id === id);
  if (!section) return next;
  const fields = section.fields as Bag;
  const image = fields.image as { assetId?: string } | undefined;
  const prior = Array.isArray(fields.slides) ? fields.slides as string[] : ["ast_before", "ast_after", image?.assetId].filter((item): item is string => Boolean(item));
  fields.slides = [...prior, assetId].slice(-6);
  return next;
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

async function jpeg(file: File) {
  const img = await loadImage(await readFile(file));
  const scale = Math.min(1, 1600 / Math.max(1, img.width));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { type: "image" as const, src: canvas.toDataURL("image/jpeg", 0.72), width: canvas.width, height: canvas.height };
}

async function videoUrl(file: File) {
  return { type: "video" as const, src: await readFile(file), width: 1600, height: 900 };
}
