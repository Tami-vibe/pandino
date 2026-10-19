import type { Site } from "@pandino/schema";

export async function exportSite(kind: "html" | "wordpress", site: Site, setNote: (value: string) => void) {
  setNote("Preparing download…");
  try {
    const response = await fetch(`/api/export?kind=${kind}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(site) });
    if (!response.ok) throw new Error("export failed");
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = kind === "html" ? "index.html" : "pandino-theme.zip";
    link.click();
    URL.revokeObjectURL(url);
    setNote("Saved");
  } catch {
    setNote("Could not export.");
  }
}
