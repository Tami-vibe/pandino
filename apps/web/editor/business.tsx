import { useState, type ChangeEvent } from "react";
import type { Site } from "@pandino/schema";

type Business = Site["business"];
type Key = "name" | "phone" | "whatsapp" | "email" | "hours" | "googleReviewsUrl";

const LINES: [Key, string][] = [
  ["name", "Name"], ["phone", "Phone"], ["whatsapp", "WhatsApp"], ["email", "Email"],
  ["hours", "Opening hours"], ["googleReviewsUrl", "Google reviews URL"],
];

export function BusinessInfo({ site, onBusiness, onTitle }: {
  site: Site;
  onBusiness: (business: Business) => void;
  onTitle: (title: string) => void;
}) {
  const business = site.business;
  const title = site.pages[0]?.title[site.locales.default] ?? "";
  function set<K extends keyof Business>(key: K, value: Business[K]) {
    onBusiness({ ...business, [key]: value });
  }
  return (
    <div className="stack">
      <Field label="Page title" value={title} onChange={onTitle} />
      {LINES.map(([key, label]) => <Field key={key} label={label} value={business[key]} onChange={(value) => set(key, value)} />)}
      <Field label="Street address" value={business.address.street} onChange={(street) => set("address", { ...business.address, street })} />
      <Field label="City" value={business.address.city} onChange={(city) => set("address", { ...business.address, city })} />
      <RatingField value={business.googleRating} onChange={(googleRating) => set("googleRating", googleRating)} />
      <Field label="Review count" value={business.googleReviewCount ?? ""} onChange={(value) => set("googleReviewCount", optionalCount(value))} />
      <p className="hint">Leave the rating blank until it is the real one. We do not invent a number.</p>
      <Field label="Warranty" value={business.warranty} rows={3} onChange={(warranty) => set("warranty", warranty)} />
      <Field label="Payment options" value={business.payments.join("\n")} rows={4} onChange={(value) => set("payments", value.split("\n"))} />
      <p className="hint">One payment or financing option per line. Phone and WhatsApp use +39… or +1….</p>
    </div>
  );
}

function Field({ label, value, rows, onChange }: {
  label: string;
  value: string | number;
  rows?: number;
  onChange: (value: string) => void;
}) {
  const props = { className: "studio-input", value, onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <label className="edit"><span>{label}</span>{rows ? <textarea {...props} rows={rows} /> : <input {...props} />}</label>;
}

function RatingField({ value, onChange }: { value: number | null; onChange: (value: number | null) => void }) {
  const [raw, setRaw] = useState(value == null ? "" : String(value));
  return <Field label="Google rating" value={raw} onChange={(next) => { setRaw(next); onChange(optionalNumber(next)); }} />;
}

function optionalNumber(raw: string) {
  if (!raw.trim() || !/^\d+(\.\d+)?$/.test(raw.trim())) return null;
  const value = Number(raw);
  return value >= 1 && value <= 5 ? value : null;
}

function optionalCount(raw: string) {
  if (!raw.trim() || !/^\d+$/.test(raw.trim())) return null;
  return Number(raw);
}
