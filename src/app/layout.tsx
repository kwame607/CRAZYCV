import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ADOM // OS | Kwame Emmanuel Adom", template: "%s | ADOM // OS" },
  description: siteDescription,
  authors: [{ name: "Kwame Emmanuel Adom" }],
  openGraph: {
    type: "website",
    siteName,
    title: "ADOM // OS | Kwame Emmanuel Adom",
    description: siteDescription,
    url: siteUrl,
  },
  twitter: { card: "summary", title: "ADOM // OS | Kwame Emmanuel Adom", description: siteDescription },
};

export const viewport: Viewport = {
  themeColor: "#080B0D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Without JavaScript the intro overlay must never hide the page. */}
        <noscript>
          <style>{".boot-overlay{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[10000] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
