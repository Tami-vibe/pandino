import type { Site } from "@pandino/schema";
import { actionHref, liveAction } from "@pandino/recipes";

const SOCIALS: [(keyof Site["business"]["socials"]) | "whatsapp", string, string][] = [
  ["whatsapp", "chat", "WhatsApp"],
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
  const href = name === "whatsapp"
    ? actionHref(liveAction(site, { type: "whatsapp", value: site.business.whatsapp || site.business.phone }))
    : site.business.socials[name];
  const sample = href.includes("example.com");
  if (!href.startsWith("http")) return <li><span className="note">Add {label}</span></li>;
  return (
    <li>
      <a href={href} aria-label={sample ? `${label} (sample)` : label}>
        <span className="icon">{icon}</span>
        {sample ? <small>sample</small> : null}
      </a>
    </li>
  );
}
