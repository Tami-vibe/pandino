import { NextResponse } from "next/server";
import { htmlPages, loadSiteCss } from "@pandino/export-html";
import { wordpressTheme } from "@pandino/export-wp";
import { zipStore } from "@pandino/export-wp/zip";
import { validateSite } from "@pandino/schema";

export async function POST(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const parsed = validateSite(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the site before exporting." }, { status: 400 });
  try {
    if (kind === "html") return file(Buffer.from(zipStore(htmlPages(parsed.data, loadSiteCss()))), "pandino-site.zip", "application/zip");
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
