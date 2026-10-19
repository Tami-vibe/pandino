import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server.edge";
import { SitePage } from "@pandino/renderer";
import type { Site } from "@pandino/schema";

const FONTS = `:root{--font-inter:"Inter",sans-serif;--font-manrope:"Manrope",sans-serif;--font-syne:"Syne",sans-serif;--font-montserrat:"Montserrat",sans-serif;--font-poppins:"Poppins",sans-serif;--font-dm:"DM Serif Display",serif;--font-playfair:"Playfair Display",serif}`;
const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=Manrope:wght@500;700&family=Montserrat:wght@700;800&family=Playfair+Display:wght@700&family=Poppins:wght@600;700&family=Syne:wght@700;800&display=swap";
export const iconFontLink = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=ads_click,auto_stories,call,call_to_action,car_repair,chat,check_circle,construction,dark_mode,deployed_code,description,desktop_windows,directions_car,format_paint,groups,html,light_mode,location_on,lock,mail,minor_crash,palette,payments,photo_camera,request_quote,save,schedule,search,sentiment_dissatisfied,smartphone,storefront,tablet_mac,verified&display=block";

export function htmlDocument(site: Site, css: string) {
  const body = renderToStaticMarkup(<SitePage site={site} />);
  const title = escapeHtml(site.business.name);
  return `<!DOCTYPE html><html lang="${site.locales.default}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><link rel="stylesheet" href="${FONT_LINK}"><link rel="stylesheet" href="${iconFontLink}"><style>${FONTS}\n${css}</style></head><body>${body}</body></html>`;
}

export function loadSiteCss() {
  const bundled = fileURLToPath(new URL("../../../apps/web/app/site.css", import.meta.url));
  const found = [bundled, join(process.cwd(), "app/site.css"), join(process.cwd(), "apps/web/app/site.css")].find((path) => existsSync(path));
  if (!found) throw new Error("missing css");
  return readFileSync(found, "utf8");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char] ?? char);
}
