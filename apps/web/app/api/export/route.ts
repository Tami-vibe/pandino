import { NextResponse } from "next/server";
import { htmlDocument, loadSiteCss } from "@pandino/export-html";
import { wordpressTheme } from "@pandino/export-wp";
import { validateSite } from "@pandino/schema";

export async function POST(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const parsed = validateSite(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the site before exporting." }, { status: 400 });
  try {
    if (kind === "html") return file(htmlDocument(parsed.data, loadSiteCss()), "index.html", "text/html; charset=utf-8");
    if (kind === "wordpress") return file(Buffer.from(wordpressTheme(parsed.data)), "pandino-theme.zip", "application/zip");
  } catch {
    return NextResponse.json({ error: "Could not export." }, { status: 500 });
  }
  return NextResponse.json({ error: "Choose an export." }, { status: 400 });
}

function file(body: BodyInit, name: string, type: string) {
  return new NextResponse(body, {
    headers: { "content-type": type, "content-disposition": `attachment; filename="${name}"` },
  });
}
