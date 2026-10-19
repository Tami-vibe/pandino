import { detectMarket, lastPlace, placesFor, verticalOf, type Market, type Vertical } from "./detect";

export type { Market, Vertical };

export type Profile = {
  name: string;
  vertical: Vertical;
  market: Market;
  city: string;
  region: string;
  country: Market;
  phone: string;
  phoneDisplay: string;
  price: string;
};

function shopName(prompt: string) {
  const cut = prompt.split(/,|\s+\bin\s+/i)[0]?.trim() ?? "";
  return (cut || "Your shop").slice(0, 80);
}

function guessCity(prompt: string) {
  const match = prompt.match(/\b(?:in|,)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  const city = match?.[1];
  if (!city || /^(Italy|Italia|USA)$/i.test(city)) return null;
  return { city, region: city };
}

export function addressLine(profile: Profile) {
  if (profile.city === "Your city") {
    return profile.market === "IT" ? "Add your street, city, and postcode" : "Add your street, city, and state";
  }
  const local = profile.region === profile.city;
  const place = local ? profile.city : profile.market === "IT" ? `${profile.city} (${profile.region})` : `${profile.city}, ${profile.region}`;
  const suffix = profile.market === "IT" ? ", Italia" : "";
  return `Add your street — ${place}${suffix}`;
}

export function mapQuery(profile: Profile) {
  const place = profile.market === "IT" ? `${profile.city}, Italia` : `${profile.city}, ${profile.region}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}

export function readProfile(prompt: string, market: "auto" | Market): Profile {
  const chosen = market === "auto" ? detectMarket(prompt) : market;
  const preferred = placesFor(chosen);
  const other = placesFor(chosen === "IT" ? "US" : "IT");
  const place = lastPlace(prompt, preferred).place ?? lastPlace(prompt, other).place ?? guessCity(prompt);
  const city = place?.city ?? "Your city";
  const region = place?.region ?? city;
  const facts = chosen === "IT"
    ? { phone: "+390000000000", phoneDisplay: "+39 ··· ··· ····", price: "da € …" }
    : { phone: "+10000000000", phoneDisplay: "+1 (···) ···-····", price: "from $…" };
  return {
    name: shopName(prompt),
    vertical: verticalOf(prompt),
    market: chosen,
    city,
    region,
    country: chosen,
    ...facts,
  };
}
