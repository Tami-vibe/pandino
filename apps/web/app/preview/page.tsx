"use client";

import { useEffect, useState } from "react";
import { validateSite, type Site } from "@pandino/schema";
import { SitePage } from "@pandino/renderer";
import { loadSite } from "../../persistence/storage";

export default function PreviewPage() {
  const [site, setSite] = useState<Site | null>(null);
  useEffect(() => {
    setSite(loadSite());
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin) return;
      const parsed = validateSite(event.data);
      if (parsed.success) setSite(parsed.data);
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage("pandino-preview-ready", location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  if (!site) return null;
  return <SitePage site={site} />;
}
