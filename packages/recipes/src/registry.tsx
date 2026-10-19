import type { ComponentType } from "react";
import { Hero, Menu, Pains } from "./lead";
import { Legal } from "./legal";
import type { Block } from "./parts";
import { Gallery, Reviews } from "./proof";
import { Quote } from "./quote";
import { CtaBand } from "./sections/cta";
import { Facility } from "./sections/facility";
import { Faq } from "./sections/faq";
import { Feature } from "./sections/feature";
import { ServiceGrid } from "./sections/grid";
import { Journey } from "./sections/journey";
import { Logos } from "./sections/logos";
import { Offer } from "./sections/offer";
import { PainPhotos } from "./sections/pains";
import { Stats } from "./sections/stats";
import { Visit } from "./sections/visit";
import { Footer, Process } from "./shop";

type View = ComponentType<Block>;

export const VARIANTS: Record<string, Record<string, View>> = {
  "hero.split-photo": { default: Hero, fullscreen: Hero, "image-right": Hero },
  "pains.cards": { default: Pains, three: Pains, photos: PainPhotos },
  "services.menu-from-prices": { default: Menu, menu: Menu, grid: ServiceGrid },
  "services.process-insurance": { default: Process, steps: Process },
  "trust.reviews-certs": { default: Reviews, cards: Reviews },
  "trust.before-after": { default: Gallery, pair: Gallery },
  "convert.quote-booking": { default: Quote, form: Quote, split: Quote },
  "footer.contact-map": { default: Footer, columns: Footer, visit: Visit },
  "legal.template": { default: Legal, prose: Legal },
  "trust.logo-strip": { default: Logos, brands: Logos },
  "trust.feature-split": { default: Feature, facility: Feature },
  "trust.facility-gallery": { default: Facility, filters: Facility },
  "convert.journey": { default: Journey, tabs: Journey },
  "trust.stats": { default: Stats, row: Stats },
  "convert.faq": { default: Faq, split: Faq },
  "convert.offer": { default: Offer, banner: Offer },
  "convert.cta-band": { default: CtaBand, band: CtaBand },
};
