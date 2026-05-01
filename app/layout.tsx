import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const gtWalsheim = localFont({
  src: "./fonts/GTWalsheim.woff2",
  variable: "--font-gt-walsheim",
  weight: "500",
});

const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-inter",
  weight: "100 900",
});

const monaSans = localFont({
  src: "./fonts/MonaSans.ttf",
  variable: "--font-mona-sans",
  weight: "100 900",
});

const azeretMono = localFont({
  src: "./fonts/AzeretMono.ttf",
  variable: "--font-azeret-mono",
  weight: "100 900",
});

const openRunde = localFont({
  src: "./fonts/OpenRunde.woff",
  variable: "--font-open-runde",
  weight: "600",
});

export const metadata: Metadata = {
  title: "Nexa Point Chatbot",
  description: "A premium AI assistant interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gtWalsheim.variable} ${inter.variable} ${monaSans.variable} ${azeretMono.variable} ${openRunde.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
