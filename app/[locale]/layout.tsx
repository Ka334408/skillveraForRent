// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google"; // استيراد Cairo
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AOSProvider from "../components/AOSProvider";
import ThemeProvider from "../components/ThemeProvider";
import "../globals.css";
import Footer from "../components/footer";


const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', 
});

const cairo = Cairo({ 
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "900"],
  variable: '--font-cairo', 
});

export const metadata: Metadata = {
  title: "SKV Rent",
  description: "SKV Rent - Facility Rental Platform",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`${locale === 'ar' ? cairo.className : inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AOSProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
              </div>
            </ThemeProvider>
          </AOSProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}