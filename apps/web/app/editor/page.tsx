import type { Metadata } from "next";
import { Editor } from "../../editor/screen";

export const metadata: Metadata = { title: "Editor · Pandino" };

export default function EditorPage() {
  return <Editor />;
}
