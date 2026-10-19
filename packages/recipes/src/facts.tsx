import type { Site } from "@pandino/schema";
import { Mark } from "./media";
import { actionHref, liveAction } from "./parts";

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

export function GoogleBadge({ site }: { site: Site }) {
  const { googleReviewsUrl: url, googleRating: rating, googleReviewCount: count } = site.business;
  const ready = url.startsWith("https://") && rating != null && count != null;
  const label = ready ? `${rating} · ${count} Google reviews` : "Add your Google rating and review link";
  return <a className="chip google-badge" href={ready ? url : "#reviews"}>{label}</a>;
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
  const chat = actionHref(liveAction(site, { type: "whatsapp", value: site.business.whatsapp || site.business.phone }));
  return (
    <nav className="tap-bar" aria-label="Call or WhatsApp">
      <a href={call}><Mark name="call" />Call</a>
      <a href={chat}><Mark name="chat" />WhatsApp</a>
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
