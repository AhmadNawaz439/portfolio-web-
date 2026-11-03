import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Ahmad Nawaz, Web App Developer and UI/UX Designer from Multan, Pakistan. Projects, skills, video editing and contact.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ahmad Nawaz | Web App Developer & UI/UX Designer",
  description,
  openGraph: {
    title: "Ahmad Nawaz | Web App Developer & UI/UX Designer",
    description,
    url: "/",
    type: "website",
    images: [{ url: "/projects/spendly-cover.jpg", width: 3200, height: 2000 }],
  },
  robots: { index: true, follow: true },
  // Google Search Console "HTML tag" code, set in Vercel as GOOGLE_SITE_VERIFICATION.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
