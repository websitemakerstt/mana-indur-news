import type { Metadata } from "next";
import { Inter, Noto_Sans_Telugu, Lora, Noto_Serif_Telugu } from "next/font/google";
import "./globals.css";
import { PageTransitionLoader } from "@/components/layout/PageTransitionProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

const teluguSans = Noto_Sans_Telugu({
  variable: "--font-telugu-sans",
  subsets: ["telugu"],
  weight: ["400", "700"],
});

const teluguSerif = Noto_Serif_Telugu({
  variable: "--font-telugu-serif",
  subsets: ["telugu"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Mana Indur News',
    default: 'Mana Indur News | Latest Telugu News Portal',
  },
  description: "Mana Indur News provides latest news from Andhra Pradesh, Telangana, India and around the world.",
  icons: {
    icon: '/websiteLogo.jpeg',
    shortcut: '/websiteLogo.jpeg',
    apple: '/websiteLogo.jpeg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="te"
      className={`${inter.variable} ${lora.variable} ${teluguSans.variable} ${teluguSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <PageTransitionLoader />
        {children}
      </body>
    </html>
  );
}

