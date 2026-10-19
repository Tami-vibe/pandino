import type { Site } from "@pandino/schema";
import type { Action } from "./fields";

const PLACEHOLDER_PHONE = /^\+(?:390+|10+)$/;

export function pageHref(slug: string, mode: "file" | "pretty") {
  const bare = slug === "/" ? "index" : slug.replace(/^\//, "");
  return mode === "file" ? `${bare}.html` : bare === "index" ? "/" : `/${bare}`;
}

export function actionHref(action: Action, site?: Site, mode: "file" | "pretty" = "file") {
  if (action.type === "open_form") {
    const slug = site?.pages.find((page) => page.sections.some((section) => section.fields.formId === action.formId))?.slug;
    return slug ? pageHref(slug, mode) : `#${action.formId ?? "quote"}`;
  }
  if (action.type === "url") return action.value ?? "#";
  if (action.value && PLACEHOLDER_PHONE.test(action.value)) return "#contact";
  if (action.type === "whatsapp") return `https://wa.me/${(action.value ?? "").replace(/\D/g, "")}`;
  if (action.type === "sms") return `sms:${action.value ?? ""}`;
  return `tel:${action.value ?? ""}`;
}
