import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevate Digital | Hospital Lead Generation Automation",
  description: "Automated Daily Small Hospital (5-25 beds) Lead Generation & Modernization Engine for Elevate Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-blue-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
