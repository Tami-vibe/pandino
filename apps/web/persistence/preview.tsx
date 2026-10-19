"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Site } from "@pandino/schema";
import { SitePage } from "@pandino/renderer";
import { loadSite } from "./storage";

export function Preview() {
  const [site, setSite] = useState<Site | null | undefined>(undefined);

  useEffect(() => {
    setSite(loadSite());
  }, []);

  if (site === undefined) return <main className="stage" />;
  if (!site) {
    return (
      <main className="stage">
        <div className="composer">
          <h1>No site yet</h1>
          <p className="lede">Generate a site and it stays in this browser.</p>
          <Link className="btn btn-fill" href="/">Back to the prompt</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <p className="draft-bar">
        Draft preview. Replace the placeholder reviews, prices, photos, certifications, and phone number before publishing.
        {" "}
        <Link href="/">Edit prompt</Link>
      </p>
      <SitePage site={site} />
    </main>
  );
}
