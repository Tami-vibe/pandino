import type { Site } from "@pandino/schema";
import { tx } from "../parts";

export function line(site: Site, value: unknown) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  return tx(site, value as Record<string, string>);
}

export function rows(value: unknown) {
  return Array.isArray(value) ? value as Record<string, unknown>[] : [];
}
