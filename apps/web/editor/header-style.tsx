import type { Site } from "@pandino/schema";

type Chrome = Site["theme"]["chrome"];

export function HeaderStyle({ chrome, onChrome }: { chrome: Chrome; onChrome: (chrome: Chrome) => void }) {
  function set<K extends keyof Chrome>(key: K, value: Chrome[K]) {
    onChrome({ ...chrome, [key]: value });
  }
  return (
    <div className="edits">
      <Choice label="Header" value={chrome.header} onChange={(value) => set("header", value as Chrome["header"])} options={[["bar", "Standard"], ["pill", "Pill group"], ["square", "Square rounded"]]} />
      <Choice label="Header tone" value={chrome.tone} onChange={(value) => set("tone", value as Chrome["tone"])} options={[["dark", "Dark"], ["white", "White"]]} />
      <Choice label="Reviews badge" value={chrome.review} onChange={(value) => set("review", value as Chrome["review"])} options={[["dark", "Dark"], ["white", "White"]]} />
      <Choice label="Header buttons" value={String(chrome.ctas)} onChange={(value) => set("ctas", Number(value) as Chrome["ctas"])} options={[["0", "None"], ["1", "Call"], ["2", "Call and estimate"]]} />
      <Choice label="Button place" value={chrome.place} onChange={(value) => set("place", value as Chrome["place"])} options={[["in", "Inside the header"], ["out", "Outside the header"]]} />
      <label className="edit"><span>Menu text {chrome.size}px</span><input className="range" type="range" min="12" max="22" step="1" aria-label="Menu text" value={chrome.size} onChange={(event) => set("size", Number(event.target.value))} /></label>
    </div>
  );
}

function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <label className="edit">
      <span>{label}</span>
      <select className="studio-input" aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </label>
  );
}
