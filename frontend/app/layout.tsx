import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <body className={`${syne.variable} ${dmSans.variable} font-sans antialiased`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
