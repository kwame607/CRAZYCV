import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const title = "Kwame Emmanuel Adom | Full-stack developer and cybersecurity learner";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Kwame Emmanuel Adom" },
  description: siteDescription,
  authors: [{ name: "Kwame Emmanuel Adom" }],
  openGraph: { type: "website", siteName, title, description: siteDescription, url: siteUrl },
  twitter: { card: "summary", title, description: siteDescription },
};

export const viewport: Viewport = {
  themeColor: "#0a0c0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. It decides three things so there is no flash:
 *  - data-js: reveal animations may hide content only when JavaScript is running;
 *  - data-intro="seen": returning visitors (or deep links) skip the long intro;
 *  - data-phase: whether the nav starts hidden behind the intro.
 * If React has not hydrated after 6s, reveal-hidden content is forced visible.
 */
const bootScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","1");var seen=false;if(location.hash.length>1)seen=true;var rm=false;try{rm=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}if(seen)d.setAttribute("data-intro","seen");d.setAttribute("data-phase",seen||rm?"site":"intro");setTimeout(function(){if(!d.hasAttribute("data-hydrated"))d.setAttribute("data-reveal","all")},6000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Without JavaScript the animation cannot run, so it must never hide the page. */}
        <noscript>
          <style>{".intro-runway{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[10000] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-bg">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
