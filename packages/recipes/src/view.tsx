import { StickyBar } from "./facts";
import { Hero, Menu, Pains } from "./lead";
import { Gallery, Reviews } from "./proof";
import { Quote } from "./quote";
import { Footer, Process } from "./shop";
import type { Block } from "./parts";

export { actionHref, liveAction, tx } from "./parts";
export { StickyBar };

const VIEWS = {
  "hero.split-photo": Hero,
  "pains.cards": Pains,
  "services.menu-from-prices": Menu,
  "services.process-insurance": Process,
  "trust.reviews-certs": Reviews,
  "trust.before-after": Gallery,
  "convert.quote-booking": Quote,
  "footer.contact-map": Footer,
};

export function Recipe({ site, section }: Block) {
  const View = VIEWS[section.recipe];
  return View ? <View site={site} section={section} /> : null;
}
