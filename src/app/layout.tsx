import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri, Cairo, Playfair_Display } from "next/font/google";
import "./globals-v4.css";
import Providers from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Arabic fonts for Jordanian design
const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
});

const cairo = Cairo({
  weight: ['400', '600', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
});

// Elegant English font
const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Aqar - عقار | Jordan Real Estate Platform",
  description: "Find your perfect rental property in Jordan - From Amman to Aqaba, Petra to Jerash",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${cairo.variable} ${playfair.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
