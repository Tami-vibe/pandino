import { renderToStaticMarkup } from "react-dom/server.edge";
import { iconFontLink, loadSiteCss } from "@pandino/export-html";
import { SitePage } from "@pandino/renderer";
import type { Site } from "@pandino/schema";
import { zipStore } from "./zip";

const SERIF = new Set(["DM Serif Display", "Playfair Display"]);
const FONTS = `:root{--font-inter:"Inter",sans-serif;--font-barlow:"Barlow Condensed",sans-serif;--font-manrope:"Manrope",sans-serif;--font-syne:"Syne",sans-serif;--font-montserrat:"Montserrat",sans-serif;--font-poppins:"Poppins",sans-serif;--font-dm:"DM Serif Display",serif;--font-playfair:"Playfair Display",serif}`;

export function wordpressTheme(site: Site) {
  const files: [string, string][] = [
    ["pandino-site/style.css", `${header(site)}\n@import url("${iconFontLink}");\n${FONTS}\n${loadSiteCss()}\n`],
    ["pandino-site/theme.json", `${JSON.stringify(tokens(site), null, 2)}\n`],
  ];
  for (const page of site.pages) files.push(template(site, page.slug));
  return zipStore(files);
}

function template(site: Site, slug: string): [string, string] {
  const name = slug === "/" ? "templates/index.html" : `templates/page-${slug}.html`;
  const html = renderToStaticMarkup(<SitePage site={site} slug={slug} links="pretty" />).replace(/<form[\s\S]*?<\/form>/g, "<p>This theme has no form. Add one with a plugin.</p>");
  return [`pandino-site/${name}`, `<!-- wp:html -->\n${html}\n<!-- /wp:html -->\n`];
}

function header(site: Site) {
  const name = site.business.name.replace(/[*/\r\n]+/g, " ").trim().slice(0, 60) || "Pandino Site";
  const rows = [
    `Theme Name: ${name}`, "Author: Pandino",
    "Description: Block theme exported from Pandino. Reviews, prices, photos, and certifications are placeholders until the owner replaces them.",
    "Requires at least: 6.6", "Tested up to: 6.7", "Requires PHP: 7.4", "Version: 1.0.0",
    "License: GNU General Public License v2 or later", "License URI: https://www.gnu.org/licenses/gpl-2.0.html", "Text Domain: pandino-site",
  ];
  return `/*\n${rows.join("\n")}\n*/`;
}

function tokens(site: Site) {
  const { palette: ink, fonts, radius } = site.theme;
  const color = (slug: string, value: string, name: string) => ({ slug, color: value, name });
  const face = (slug: string, name: string) => ({ slug, name, fontFamily: `${name}, ${SERIF.has(name) ? "serif" : "sans-serif"}` });
  const curve = radius === "sm" ? "10px" : radius === "lg" ? "22px" : "16px";
  return {
    $schema: "https://schemas.wp.org/wp/6.7/theme.json",
    version: 3,
    settings: {
      layout: { contentSize: "720px", wideSize: "1120px" },
      color: { palette: [color("primary", ink.primary, "Primary"), color("on-primary", ink.onPrimary, "On primary"), color("surface", ink.surface, "Surface"), color("ink", ink.text, "Text")] },
      typography: { fontFamilies: [face("heading", fonts.heading), face("body", fonts.body)] },
    },
    styles: {
      color: { background: "var(--wp--preset--color--surface)", text: "var(--wp--preset--color--ink)" },
      typography: { fontFamily: "var(--wp--preset--font-family--body)", fontSize: "1.125rem" },
      elements: {
        heading: { typography: { fontFamily: "var(--wp--preset--font-family--heading)", fontWeight: "800" } },
        button: { color: { background: "var(--wp--preset--color--primary)", text: "var(--wp--preset--color--on-primary)" }, border: { radius: curve } },
      },
    },
  };
}
