export type Look = { tlh?: number; tw?: number; ttr?: number; slh?: number; sw?: number; str?: number; sz?: number };
type Bag = Record<string, unknown>;

export function Columns({ count, cols, locale, onPatch, onFile }: { count: number; cols: unknown; locale: string; onPatch: (index: number, col: Bag) => void; onFile: (file: File, index: number) => void }) {
  const list = Array.isArray(cols) ? cols as Bag[] : [];
  return Array.from({ length: count }, (_, index) => <Column key={index} n={index + 1} col={list[index] ?? {}} locale={locale} onPatch={(col) => onPatch(index, col)} onFile={(file) => onFile(file, index)} />);
}

function Column({ n, col, locale, onPatch, onFile }: { n: number; col: Bag; locale: string; onPatch: (col: Bag) => void; onFile: (file: File) => void }) {
  const text = (col.text as Record<string, string> | undefined) ?? {};
  return (
    <fieldset className="nest">
      <legend>Column {n}</legend>
      <FilePick label="Image or video" aria={`Column ${n} media`} onFile={onFile} />
      <label className="edit"><span>Text</span><input className="studio-input" aria-label={`Column ${n} text`} value={text[locale] ?? ""} onChange={(event) => onPatch({ text: { ...text, [locale]: event.target.value } })} /></label>
      <Pick label="Place" aria={`Column ${n} place`} value={String(col.place ?? "center")} options={[["top", "Top"], ["center", "Center"], ["bottom", "Bottom"]]} onChange={(place) => onPatch({ place })} />
      <label className="edit"><span>Text box color</span><input className="studio-input" type="color" aria-label={`Column ${n} color`} value={typeof col.color === "string" ? col.color : "#090d16"} onChange={(event) => onPatch({ color: event.target.value })} /></label>
    </fieldset>
  );
}

export function TypeRow({ title, look, keys, onLook }: { title: string; look: Look; keys: (keyof Look)[]; onLook: (look: Look) => void }) {
  const name = (key: keyof Look) => (key.endsWith("w") ? "Weight" : key.endsWith("tr") ? "Spacing" : "Line height");
  return <fieldset className="nest"><legend>{title}</legend>{keys.map((key) => <label className="edit" key={key}><span>{name(key)} {key.endsWith("tr") ? Number(look[key]).toFixed(2) : look[key]}</span><input className="range" type="range" min={key.endsWith("w") ? 400 : key.endsWith("tr") ? -0.08 : 0.9} max={key.endsWith("w") ? 900 : key.endsWith("tr") ? 0.16 : key === "tlh" ? 1.4 : 2} step={key.endsWith("w") ? 10 : 0.01} aria-label={`${title} ${name(key).toLowerCase()}`} value={look[key]} onChange={(event) => onLook({ ...look, [key]: Number(event.target.value) })} /></label>)}</fieldset>;
}

export function Range({ label, aria, min, max, step, value, onChange }: { label: string; aria: string; min: number; max: number; step: number; value: number; onChange: (next: number) => void }) {
  return <label className="edit"><span>{label}</span><input className="range" type="range" min={min} max={max} step={step} aria-label={aria} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

export function Pick({ label, aria, value, options, onChange }: { label: string; aria: string; value: string; options: string[][]; onChange: (next: string) => void }) {
  return <label className="edit"><span>{label}</span><select className="studio-input" aria-label={aria} value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([item, name]) => <option key={item} value={item}>{name}</option>)}</select></label>;
}

export function FilePick({ label, aria, onFile }: { label: string; aria: string; onFile: (file: File) => void }) {
  return <label className="edit"><span>{label}</span><input className="studio-input" type="file" accept="image/*,video/*" aria-label={aria} onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file); }} /></label>;
}
