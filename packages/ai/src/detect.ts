import places from "../places.json" with { type: "json" };

export type Market = "US" | "IT";
export type Vertical = "garage" | "body_shop" | "tyre_shop" | "glass_shop";

type Place = { key: string; city: string; region: string };

export function placesFor(market: Market): Place[] {
  return places[market].map(([key, city, region]) => ({ key: key ?? "", city: city ?? "", region: region ?? "" }));
}

const IT_WORDS = ["italy", "italia"];
const US_WORDS = ["united states", "usa", "u.s.a."];

function atWord(prompt: string, word: string) {
  const hay = prompt.toLowerCase();
  const found = hay.lastIndexOf(word);
  if (found < 0) return -1;
  const before = found === 0 ? " " : hay[found - 1] ?? " ";
  const after = hay[found + word.length] ?? " ";
  const boundary = /[^a-z]/;
  return boundary.test(before) && boundary.test(after) ? found : -1;
}

export function lastPlace(prompt: string, table: Place[]) {
  let best: Place | null = null;
  let at = -1;
  for (const place of table) {
    const found = atWord(prompt, place.key);
    if (found > at) {
      best = place;
      at = found;
    }
  }
  return { place: best, at };
}

export function detectMarket(prompt: string): Market {
  const italy = Math.max(...IT_WORDS.map((word) => atWord(prompt, word)), lastPlace(prompt, placesFor("IT")).at);
  const usa = Math.max(...US_WORDS.map((word) => atWord(prompt, word)), lastPlace(prompt, placesFor("US")).at);
  if (italy < 0 && usa < 0) return "US";
  return italy > usa ? "IT" : "US";
}

export function verticalOf(prompt: string): Vertical {
  const text = prompt.toLowerCase();
  if (/\b(glass|windscreens?|windshields?|adas)\b/.test(text)) return "glass_shop";
  if (/\b(tyres?|tires?|gommista|wheels?|alignment)\b/.test(text)) return "tyre_shop";
  if (/\b(body|collision|paint|dents?|refinish\w*|carrozzeria)\b/.test(text)) return "body_shop";
  return "garage";
}
