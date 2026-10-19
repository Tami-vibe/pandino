"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { themeFromBrand } from "@pandino/theme";
import { Tools, submit } from "./tools";

const SAMPLES = [
  ["Futura, Milano", "Futura Auto Body Shop, Milano, Italy"],
  ["Rossi, Chicago", "Rossi Auto Body, collision repair and refinishing in Chicago"],
] as const;

export function PromptScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [brandColor, setBrandColor] = useState("#E11D48");
  const [market, setMarket] = useState("auto");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const theme = themeFromBrand(validHex(brandColor) ? brandColor : "#E11D48");
  const fields = { prompt, brandColor, market, setError, setBusy, router };

  return (
    <main className="stage" style={{ "--glow": theme.palette.primary } as CSSProperties}>
      <form className="composer" onSubmit={(event: FormEvent<HTMLFormElement>) => { void submit(event, fields); }}>
        <p className="mark">Pandino</p>
        <h1>A website for your shop, from one description.</h1>
        <p className="lede">Pick a brand color. Pandino fills a recipe site. Reviews, prices, photos, and certifications stay as placeholders until you replace them.</p>
        <textarea
          value={prompt}
          required
          minLength={3}
          maxLength={500}
          placeholder="Futura Auto Body Shop, Milano, Italy"
          onChange={(event) => setPrompt(event.target.value)}
        />
        <Tools
          brandColor={brandColor}
          market={market}
          busy={busy}
          primary={theme.palette.primary}
          onPrimary={theme.palette.onPrimary}
          onBrand={(value) => setBrandColor(value.toUpperCase())}
          onMarket={setMarket}
        />
        {error ? <p className="form-error" role="alert">{error}</p> : null}
      </form>
      <Samples onPick={setPrompt} />
    </main>
  );
}

function Samples({ onPick }: { onPick: (value: string) => void }) {
  return (
    <div className="samples">
      {SAMPLES.map(([label, value]) => (
        <button key={value} type="button" onClick={() => onPick(value)}>{label}</button>
      ))}
    </div>
  );
}

function validHex(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
