import type { Site } from "@pandino/schema";
import type { Action } from "./fields";

const PLACEHOLDER_PHONE = /^\+(?:390+|10+)$/;

export function pageHref(slug: string, mode: "file" | "pretty") {
  const bare = slug === "/" ? "index" : slug.replace(/^\//, "");
  return mode === "file" ? `${bare}.html` : bare === "index" ? "/" : `/${bare}`;
}

export function actionHref(action: Action, site?: Site, mode: "file" | "pretty" = "file") {
  if (action.type === "open_form") return formHref(action, site, mode);
  if (action.type === "url") return action.value ?? "#";
  if (action.value && PLACEHOLDER_PHONE.test(action.value)) return "#contact";
  if (action.type === "whatsapp") return `https://wa.me/${(action.value ?? "").replace(/\D/g, "")}`;
  if (action.type === "sms") return `sms:${action.value ?? ""}`;
  return `tel:${action.value ?? ""}`;
}

function formHref(action: Action, site: Site | undefined, mode: "file" | "pretty") {
  const pages = site?.pages.filter((page) => page.sections.some((section) => section.fields.formId === action.formId)) ?? [];
  const found = pages.find((page) => page.slug === "estimate") ?? pages[0];
  return found ? pageHref(found.slug, mode) : `#${action.formId ?? "quote"}`;
}
