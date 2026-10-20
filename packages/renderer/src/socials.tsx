import type { Site } from "@pandino/schema";

const SOCIALS: [keyof Site["business"]["socials"], string, string][] = [
  ["facebook", "public", "Facebook"],
  ["instagram", "photo_camera", "Instagram"],
  ["tiktok", "movie", "TikTok"],
  ["youtube", "play_circle", "YouTube"],
  ["google", "storefront", "Google Business"],
];

export function Socials({ site }: { site: Site }) {
  return (
    <ul className="socials">
      {SOCIALS.map(([key, icon, label]) => <Social key={key} site={site} name={key} icon={icon} label={label} />)}
    </ul>
  );
}

function Social({ site, name, icon, label }: { site: Site; name: (typeof SOCIALS)[number][0]; icon: string; label: string }) {
  const href = site.business.socials[name];
  const ready = href.startsWith("http");
  return (
    <li>
      <a href={ready ? href : "#footer"} aria-label={ready && !href.includes("example.com") ? label : `${label} (sample)`}>
        <span className="icon">{icon}</span>
      </a>
    </li>
  );
}
