import { validateSite, type Site } from "@pandino/schema";

const KEY = "pandino.site";

export function saveSite(input: unknown) {
  const parsed = validateSite(input);
  if (!parsed.success) throw new Error("invalid site");
  localStorage.setItem(KEY, JSON.stringify(parsed.data));
}

export function loadSite(): Site | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = validateSite(JSON.parse(raw) as unknown);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
