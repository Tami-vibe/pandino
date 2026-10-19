import { validateSite, type Site } from "@pandino/schema";

const KEY = "pandino.site";
let timer = 0;

export function saveSite(input: unknown) {
  const parsed = validateSite(input);
  if (!parsed.success) throw new Error("invalid site");
  localStorage.setItem(KEY, JSON.stringify(parsed.data));
  return parsed.data;
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

export function autosaveSite(input: unknown, done?: (ok: boolean) => void) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    try {
      saveSite(input);
      done?.(true);
    } catch {
      done?.(false);
    }
  }, 350);
}

export function saveNow(input: unknown) {
  window.clearTimeout(timer);
  saveSite(input);
}
