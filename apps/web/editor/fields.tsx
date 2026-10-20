import { fieldLabel } from "./groups";

const SKIP = new Set(["image", "before", "after", "action", "assetId", "formId", "placeholder", "primaryCta"]);
const LONG = /headline|subhead|body|quote|detail|note|caption|address|photo/;
type Bag = Record<string, unknown>;

export function TextFields({ value, locale, onChange }: { value: unknown; locale: string; onChange: (next: unknown) => void }) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const bag = value as Bag;
  return Object.entries(bag).map(([key, child]) => (
    <Field key={key} name={key} value={child} locale={locale} onChange={(next) => onChange({ ...bag, [key]: next })} />
  ));
}

function Field({ name, value, locale, onChange }: { name: string; value: unknown; locale: string; onChange: (next: unknown) => void }) {
  if (SKIP.has(name) || value == null || typeof value === "boolean") return null;
  if (isCta(value, locale)) {
    const label = value.label;
    return <Input name={name} text={label[locale] ?? ""} long={false} onChange={(text) => onChange({ ...value, label: { ...label, [locale]: text } })} />;
  }
  if (isCopy(value, locale)) {
    const text = value[locale] ?? "";
    return <Input name={name} text={text} long={LONG.test(name) || text.length > 72} onChange={(next) => onChange({ ...value, [locale]: next })} />;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <fieldset className="nest" key={`${name}-${index}`}>
        <legend>{fieldLabel(name)} {index + 1}</legend>
        <TextFields value={item} locale={locale} onChange={(next) => onChange(value.map((entry, place) => (place === index ? next : entry)))} />
      </fieldset>
    ));
  }
  if (typeof value === "object") {
    return <fieldset className="nest"><legend>{fieldLabel(name)}</legend><TextFields value={value} locale={locale} onChange={onChange} /></fieldset>;
  }
  if (typeof value === "string") return <Input name={name} text={value} long={LONG.test(name) || value.length > 72} onChange={onChange} />;
  return null;
}

function Input({ name, text, long, onChange }: { name: string; text: string; long: boolean; onChange: (next: string) => void }) {
  const props = { className: "studio-input", value: text, onChange: (event: { target: { value: string } }) => onChange(event.target.value) };
  return (
    <label className="edit">
      <span>{fieldLabel(name)}</span>
      {long ? <textarea rows={3} {...props} /> : <input {...props} />}
    </label>
  );
}

function isCopy(value: unknown, locale: string): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.values(value);
  return entries.length > 0 && locale in value && entries.every((item) => typeof item === "string");
}

function isCta(value: unknown, locale: string): value is { label: Record<string, string>; action: object } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Bag;
  return typeof record.action === "object" && record.action !== null && isCopy(record.label, locale);
}
