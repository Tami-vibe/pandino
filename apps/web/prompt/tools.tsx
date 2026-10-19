"use client";

import type { FormEvent } from "react";
import { saveSite } from "../persistence/storage";

type Fields = {
  prompt: string;
  brandColor: string;
  market: string;
  setError: (value: string) => void;
  setBusy: (value: boolean) => void;
  router: { push: (href: string) => void };
};

export function Tools({ brandColor, market, busy, primary, onPrimary, onBrand, onMarket }: {
  brandColor: string;
  market: string;
  busy: boolean;
  primary: string;
  onPrimary: string;
  onBrand: (value: string) => void;
  onMarket: (value: string) => void;
}) {
  const swatch = /^#[0-9A-Fa-f]{6}$/.test(brandColor) ? brandColor : "#E11D48";
  return (
    <div className="tools">
      <label className="swatch">
        Brand color
        <input type="color" value={swatch} aria-label="Brand color" onChange={(event) => onBrand(event.target.value)} />
        <input value={brandColor} aria-label="Brand color hex" onChange={(event) => onBrand(event.target.value)} />
      </label>
      <label>
        Market
        <select value={market} onChange={(event) => onMarket(event.target.value)}>
          <option value="auto">Auto</option>
          <option value="IT">Italy</option>
          <option value="US">United States</option>
        </select>
      </label>
      <button type="submit" disabled={busy} style={{ background: primary, color: onPrimary }}>
        {busy ? "Writing your site…" : "Generate"}
      </button>
    </div>
  );
}

export async function submit(event: FormEvent<HTMLFormElement>, fields: Fields) {
  event.preventDefault();
  fields.setBusy(true);
  fields.setError("");
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: fields.prompt, brandColor: fields.brandColor, market: fields.market }),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      fields.setBusy(false);
      fields.setError(message(body));
      return;
    }
    saveSite(body);
    fields.router.push("/preview");
  } catch {
    fields.setBusy(false);
    fields.setError("Could not generate a site.");
  }
}

function message(body: unknown) {
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string") return body.error;
  return "Could not generate a site.";
}
