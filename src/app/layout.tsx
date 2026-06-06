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
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ko: "/ko",
    },
  },
  openGraph: {
    title: "ClearKorea",
    description:
      "An online square for citizens demanding electoral transparency and a fair re-vote.",
    url: "https://clearkorea.com/",
    siteName: "ClearKorea",
    images: ["/og.png"],
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearKorea",
    description:
      "Your voice, on the record. A civic platform for Korean election transparency.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/pwa-icon.svg",
    apple: "/pwa-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
