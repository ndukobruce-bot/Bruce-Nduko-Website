import type { Metadata } from "next";
import { TerminalApp } from "@/components/terminal-app";
import { fileExistsInPublic } from "@/lib/files";

export const metadata: Metadata = {
  title: "Terminal — Bruce Nduko",
  description: "Bruce Nduko's site, as a terminal.",
};

export default function TerminalPage() {
  const hasCv = fileExistsInPublic("cv.pdf");
  return <TerminalApp hasCv={hasCv} />;
}
