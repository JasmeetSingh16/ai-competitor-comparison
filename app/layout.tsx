import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/jaseir-kit.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { agentMetadata } from "../lib/agent-metadata";
import type { SiteZone } from "../lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = agentMetadata("competitor-comparison");

const zone: SiteZone = { kind: "agent", slug: "competitor-comparison" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader zone={zone} />
        {children}
        <SiteFooter
          zone={zone}
          cta={{
            title: "Want to turn the gap into a campaign?",
            text: "We take the positioning, rewrite your key pages around it and build the SEO and ad plan to win the comparisons your buyers are already making.",
          }}
        />
      </body>
    </html>
  );
}
