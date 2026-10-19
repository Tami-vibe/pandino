import { NextResponse } from "next/server";
import { generateSite } from "@pandino/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Check the prompt and brand color." }, { status: 400 });
  }
  const { prompt, brandColor, market } = body as { prompt?: unknown; brandColor?: unknown; market?: unknown };
  if (typeof prompt !== "string" || prompt.trim().length < 3 || prompt.trim().length > 500) {
    return NextResponse.json({ error: "Describe the shop in a few words." }, { status: 400 });
  }
  if (typeof brandColor !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(brandColor)) {
    return NextResponse.json({ error: "Pick a brand color." }, { status: 400 });
  }
  const chosen = market === "US" || market === "IT" ? market : "auto";
  try {
    const site = await generateSite({ prompt: prompt.trim(), brandColor, market: chosen });
    return NextResponse.json(site);
  } catch {
    return NextResponse.json({ error: "Could not generate a site." }, { status: 500 });
  }
}
