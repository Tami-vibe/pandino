import { Gallery, Footer, Quote, Reviews } from "./proof";
import { Hero, Menu, Pains, Process } from "./lead";
import type { Block } from "./parts";

export { actionHref, tx } from "./parts";

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
