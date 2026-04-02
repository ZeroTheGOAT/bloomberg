import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroPinnacle — Real-Time Global Trading Intelligence Dashboard",
  description: "Free real-time global trading intelligence dashboard with live markets, 3D geopolitical visualization, AI news summaries, Indian indices (NIFTY, Bank Nifty), US markets, crypto tracking, and live TV. All in one view, zero API cost.",
  keywords: "trading, nifty, bank nifty, sensex, crypto, bitcoin, ethereum, S&P 500, real-time, dashboard, markets, live news, OSINT, free trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
