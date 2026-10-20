import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server.edge";
import { SitePage } from "@pandino/renderer";
import type { Site } from "@pandino/schema";

const FONTS = `:root{--font-inter:"Inter",sans-serif;--font-barlow:"Barlow Condensed",sans-serif;--font-manrope:"Manrope",sans-serif;--font-syne:"Syne",sans-serif;--font-montserrat:"Montserrat",sans-serif;--font-poppins:"Poppins",sans-serif;--font-dm:"DM Serif Display",serif;--font-playfair:"Playfair Display",serif}`;
export const iconFontLink = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
const COOKIE = `<script>(function(){var k="pandino-cookie";try{var v=localStorage.getItem(k);if(v)document.documentElement.dataset.cookie=v;}catch(e){}document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-cookie-choice]");if(!b)return;var c=b.getAttribute("data-cookie-choice");try{localStorage.setItem(k,c);}catch(err){}document.documentElement.dataset.cookie=c;});document.addEventListener("input",function(e){var t=e.target;if(!t||!t.matches||!t.matches(".ba input"))return;var box=t.parentElement;if(box)box.style.setProperty("--pos",t.value+"%");});})()</script>`;

export function htmlDocument(site: Site, css: string, slug = site.pages[0]?.slug ?? "/") {
  const body = renderToStaticMarkup(<SitePage site={site} slug={slug} links="file" />);
  const title = escapeHtml(site.business.name);
  return `<!DOCTYPE html><html lang="${site.locales.default}" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><link rel="stylesheet" href="${iconFontLink}"><link rel="stylesheet" href="css/tokens-base.css"><link rel="stylesheet" href="css/daisyui-components.css"><style>${FONTS}\n${css}</style></head><body class="bg-base-100 text-base-content antialiased scheme-dark">${body}${COOKIE}</body></html>`;
}

export function styleSheets(): [string, string][] {
  const tokens = fileURLToPath(new URL("../../../apps/web/public/css/tokens-base.css", import.meta.url));
  const daisy = fileURLToPath(new URL("../../../apps/web/public/css/daisyui-components.css", import.meta.url));
  return [["css/tokens-base.css", readFileSync(tokens, "utf8")], ["css/daisyui-components.css", readFileSync(daisy, "utf8")]];
}

export function htmlPages(site: Site, css: string) {
  return site.pages.map((page) => [fileName(page.slug), htmlDocument(site, css, page.slug)] as [string, string]);
}

export function loadSiteCss() {
  const bundled = fileURLToPath(new URL("../../../apps/web/app/site.css", import.meta.url));
  const found = [bundled, join(process.cwd(), "app/site.css"), join(process.cwd(), "apps/web/app/site.css")].find((path) => existsSync(path));
  if (!found) throw new Error("missing css");
  const page = fileURLToPath(new URL("../../../apps/web/app/smiley.css", import.meta.url));
  return `${readFileSync(found, "utf8")}\n${readFileSync(page, "utf8")}`;
}

function fileName(slug: string) {
  return `${slug === "/" ? "index" : slug.replace(/^\//, "")}.html`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char] ?? char);
}
