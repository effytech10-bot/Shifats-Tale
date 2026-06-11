import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shifat's Tales — Academic & Admission Care",
  description: "Premium personal coaching program specialized in Physics and Higher Mathematics. Mentored directly by Md. Zia Uddin Azad Sifat (Shifat Sir) in Rangunia, Chattogram. Focused on SSC, HSC board exams and engineering/varsity admissions.",
  keywords: [
    "Shifat's Tales",
    "Shifat Sir Coaching",
    "Md. Zia Uddin Azad Sifat",
    "Physics Coaching Chattogram",
    "Mathematics Admission Care",
    "BUET Admission Care",
    "CUET Admission Care",
    "Coaching center Rangunia"
  ],
  authors: [{ name: "Md. Zia Uddin Azad Sifat" }],
  openGraph: {
    title: "Shifat's Tales — Academic & Admission Care",
    description: "Premium personal coaching program specialized in Physics and Higher Mathematics by Shifat Sir.",
    type: "website",
    locale: "en_US",
    siteName: "Shifat's Tales",
  }
};

export default function RootLayout({
  children,
  // Let's keep the parameter standard
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 font-sans">{children}</body>
    </html>
  );
}
