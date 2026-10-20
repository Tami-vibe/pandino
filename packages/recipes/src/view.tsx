import { StickyBar } from "./facts";
import type { Block } from "./parts";
import { VARIANTS } from "./registry";

export { actionHref, liveAction, pageHref, tx } from "./parts";
export { SiteMenu } from "./menu";
export { placeLine, phoneLabel } from "./facts";
export { StickyBar };

export function Recipe({ site, section }: Block) {
  const views = VARIANTS[section.recipe];
  const View = views?.[section.variant] ?? views?.default;
  return View ? <View site={site} section={section} /> : null;
}
