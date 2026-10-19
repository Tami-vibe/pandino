import type { Site } from "@pandino/schema";
import { Mark } from "./media";
import { actionHref, liveAction, pageHref } from "./parts";

export function placeLine(site: Site) {
  const { street, city, region, country } = site.business.address;
  const place = region === city ? city : country === "IT" ? `${city} (${region})` : `${city}, ${region}`;
  const suffix = country === "IT" && city !== "Your city" ? ", Italia" : "";
  const line = `${place}${suffix}`;
  if (street.trim() === "Via Esempio 12") return "Via Esempio 12, 20100 Milano MI (sample)";
  return street.trim() ? `${street}, ${line}` : `Add your street — ${line}`;
}

export function directionsQuery(site: Site) {
  const { street, city, region, country } = site.business.address;
  return [street, city, region, country].filter((part) => part.trim() && part !== "Your city").join(", ");
}

export function phoneLabel(site: Site) {
  if (site.business.phone === "+390200000000") return "+39 02 0000 0000 (sample)";
  if (/^\+(?:390+|10+)$/.test(site.business.phone)) {
    return site.business.market === "IT" ? "+39 ··· ··· ····" : "+1 (···) ···-····";
  }
  return site.business.phone;
}

export function ReviewBadge({ site }: { site: Site }) {
  const reviews = site.reviews ?? [];
  const count = reviews.length;
  const sample = reviews.every((item) => item.source === "sample");
  const score = count ? Math.round(reviews.reduce((sum, item) => sum + item.rating, 0) / count) : 0;
  const label = count ? `${sample ? "Sample · " : ""}${score} · ${count} reviews` : "Sample · add your reviews";
  const id = site.pages.flatMap((page) => page.sections).find((section) => section.recipe === "trust.reviews-certs")?.id ?? "reviews";
  return <a className="hero-reviews badge badge-neutral gap-2 py-3 px-4 border border-white/20 mb-4 inline-flex items-center review-badge" href={`#${id}`}>{label}</a>;
}

export function MapboxMap({ query }: { query: string }) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "address")}`;
  return (
    <div className="mapbox-slot frame" data-slot="mapbox">
      <span><Mark name="location_on" />Map placeholder. Mapbox goes here later.</span>
      <a href={href}>Get directions</a>
    </div>
  );
}

export function StickyBar({ site }: { site: Site }) {
  const call = actionHref(liveAction(site, { type: "tel", value: site.business.phone }));
  return (
    <nav className="tap-bar" aria-label="Call or get an estimate">
      <a href={call}><Mark name="call" />Call</a>
      <a href={pageHref("estimate", "file")}><Mark name="request_quote" />Get an estimate</a>
    </nav>
  );
}

export function Payments({ site }: { site: Site }) {
  const items = site.business.payments.map((item) => item.trim()).filter(Boolean);
  if (!items.length) return <p className="note">Add payment and financing options you actually offer.</p>;
  return <ul className="pay"><li className="pay-mark"><Mark name="payments" /></li>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function warrantyLine(site: Site) {
  return site.business.warranty.trim() || "Add your warranty or guarantee. Nothing is listed until you write it.";
}
