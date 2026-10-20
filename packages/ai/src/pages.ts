import { validateSite, type Site } from "@pandino/schema";
import legalCopy from "../legal.json" with { type: "json" };
import { homeSections, sampleReviews } from "./home";
import { legalPage, makePage } from "./legal-page";
import { menuSections } from "./menu";

type Section = Site["pages"][number]["sections"][number];

export function spreadPages(site: Site): Site {
  const next = structuredClone(site);
  const locale = next.locales.default;
  const pool = next.pages.flatMap((page) => page.sections);
  const pages = [
    makePage("/", "Home", true, homeSections(pool), locale),
    makePage("services", "Services", true, menuSections(pool, next.business.vertical, locale), locale),
    makePage("process", "Repairs", true, copied(pool, "services.process-insurance"), locale),
    makePage("gallery", "Gallery", true, gallery(pool), locale),
    makePage("contact", "Contact", true, copied(pool, "footer.contact-map"), locale),
    makePage("estimate", "Get an estimate", false, copied(pool, "convert.quote-booking"), locale),
  ];
  for (const item of legalCopy[next.business.market]) pages.push(legalPage(item, locale));
  if (!next.reviews.length) next.reviews = sampleReviews();
  next.pages = pages.filter((page) => page.sections.length > 0);
  const parsed = validateSite(next);
  if (!parsed.success) throw new Error("Paged site failed validation");
  return parsed.data;
}

function gallery(pool: Section[]) {
  return [...copied(pool, "trust.reviews-certs"), ...copied(pool, "trust.before-after")];
}

function copied(pool: Section[], recipe: string) {
  return pool.filter((section) => section.recipe === recipe).map((section, index) => ({
    ...structuredClone(section),
    id: `${section.id}_${index}`,
  }));
}
