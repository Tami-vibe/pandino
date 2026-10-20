import type { MouseEvent } from "react";

export function paintTags(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("section[data-label]").forEach((section) => {
    let tag = section.querySelector<HTMLElement>(":scope > .section-tag");
    if (!tag) {
      tag = document.createElement("span");
      tag.className = "section-tag";
      tag.setAttribute("aria-hidden", "true");
      section.prepend(tag);
    }
    const name = document.createElement("span");
    name.textContent = section.dataset.label ?? "";
    if (!section.dataset.icon) {
      tag.replaceChildren(name);
      return;
    }
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = section.dataset.icon;
    tag.replaceChildren(icon, name);
  });
}

export function onPreviewClick(event: MouseEvent, setSlug: (slug: string) => void, setSpot: (value: { id: string; tick: number } | ((prev: { id: string; tick: number }) => { id: string; tick: number })) => void) {
  const choice = (event.target as HTMLElement).closest<HTMLElement>("[data-cookie-choice]");
  if (choice) {
    const value = choice.getAttribute("data-cookie-choice") ?? "";
    document.documentElement.dataset.cookie = value;
    localStorage.setItem("pandino-cookie", value);
  }
  followLink(event, setSlug);
  if (window.parent === window) return;
  const node = (event.target as HTMLElement).closest<HTMLElement>("[data-group]");
  const sid = node?.dataset.sid || node?.id;
  if (!sid || !node?.dataset.group) return;
  setSpot((prev) => ({ id: sid, tick: prev.tick + 1 }));
  window.parent.postMessage({ type: "pandino-select", id: sid, group: node.dataset.group }, location.origin);
}

function followLink(event: MouseEvent, setSlug: (slug: string) => void) {
  const href = (event.target as HTMLElement).closest("a")?.getAttribute("href") ?? "";
  const file = href.split("#")[0] ?? "";
  if (!file.endsWith(".html")) return;
  event.preventDefault();
  const name = file.replace(/^\.\//, "").replace(/\.html$/, "");
  const slug = name === "index" ? "/" : name;
  setSlug(slug);
  if (window.parent !== window) window.parent.postMessage({ type: "pandino-page", slug }, location.origin);
  const hash = href.split("#")[1];
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}
