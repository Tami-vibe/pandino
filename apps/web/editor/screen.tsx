"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Site } from "@pandino/schema";
import { loadSite } from "../persistence/storage";
import "../app/editor.css";
import { Studio } from "./studio";

export function Editor() {
  const [site, setSite] = useState<Site | null | undefined>(undefined);
  useEffect(() => { setSite(loadSite()); }, []);
  if (site === undefined) return <main className="studio" data-theme="light" />;
  if (!site) return <Empty />;
  return <Studio initial={site} />;
}

function Empty() {
  return (
    <main className="studio empty-wrap" data-theme="light">
      <div className="empty">
        <h1>No site yet</h1>
        <p>Generate a site and it stays in this browser.</p>
        <Link href="/">Back to the prompt</Link>
      </div>
    </main>
  );
}
