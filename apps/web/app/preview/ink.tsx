export function watchInk(root: HTMLElement) {
  const paint = () => paintInk(root);
  paint();
  const media = shot(root);
  media?.addEventListener("load", paint);
  media?.addEventListener("loadeddata", paint);
  return () => { media?.removeEventListener("load", paint); media?.removeEventListener("loadeddata", paint); };
}

function paintInk(root: HTMLElement) {
  const header = root.querySelector("header");
  const score = luminance(shot(root));
  if (header && score != null) header.setAttribute("data-ink", score > 0.55 ? "dark" : "light");
}

function shot(root: HTMLElement) {
  const list = root.querySelectorAll<HTMLImageElement | HTMLVideoElement>("#hero .is-active img, #hero .is-active video, #hero .hero-col img, #hero .hero-col video");
  return list[list.length - 1];
}

function luminance(node?: HTMLImageElement | HTMLVideoElement) {
  const width = node instanceof HTMLVideoElement ? node.videoWidth : node?.naturalWidth ?? 0;
  const height = node instanceof HTMLVideoElement ? node.videoHeight : node?.naturalHeight ?? 0;
  const canvas = document.createElement("canvas");
  canvas.width = 12;
  canvas.height = 12;
  const pen = width && height ? canvas.getContext("2d", { willReadFrequently: true }) : null;
  if (!node || !pen) return null;
  try {
    pen.drawImage(node, width * 0.68, 0, width * 0.32, height * 0.28, 0, 0, 12, 12);
    const data = pen.getImageData(0, 0, 12, 12).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += 0.2126 * lift((data[i] ?? 0) / 255) + 0.7152 * lift((data[i + 1] ?? 0) / 255) + 0.0722 * lift((data[i + 2] ?? 0) / 255);
    return sum / (data.length / 4);
  } catch { return null; }
}

function lift(channel: number) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}
