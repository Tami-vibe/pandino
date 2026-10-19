import type { Site } from "@pandino/schema";
import type { RailId } from "./groups";

export function focusSection(site: Site, id: string, setHot: (value: string) => void, setSlug: (value: string) => void) {
  setHot(id);
  const found = site.pages.find((page) => page.sections.some((section) => section.id === id));
  if (found) setSlug(found.slug);
}

export function openStudioPage(site: Site, slug: string, setSlug: (value: string) => void, setGroup: (value: RailId) => void, setHot: (value: string) => void, setJump: (value: (n: number) => number) => void) {
  setSlug(slug);
  setGroup("pages");
  setHot(site.pages.find((page) => page.slug === slug)?.sections[0]?.id ?? "");
  setJump((n) => n + 1);
}

export function sectionId(site: Site, group: string, slug: string) {
  const page = site.pages.find((item) => item.slug === slug) ?? site.pages[0];
  return page?.sections.find((section) => section.group === group)?.id ?? "";
}
