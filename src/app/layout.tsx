import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clearkorea.com"),
  title: {
    default: "ClearKorea",
    template: "%s | ClearKorea",
  },
  description:
    "A civic-tech platform for lawful participation, rally support, verified posts, and election transparency.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
