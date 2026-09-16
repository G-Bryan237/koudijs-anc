import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { Shell } from "@/components/ui";
import "./globals.css";
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  const en = (await cookies()).get("anc_locale")?.value === "en";
  return {
    title: {
      default: en
        ? "Animal Nutrition Cameroon | KOUDIJS feed in Cameroon"
        : "Animal Nutrition Cameroon | Aliments KOUDIJS au Cameroun",
      template: "%s | Animal Nutrition Cameroon",
    },
    description: en
      ? "KOUDIJS feed for aquaculture, poultry and pigs. Cattle enquiries, guidance, quotations and delivery across Cameroon from Yaoundé."
      : "Aliments KOUDIJS pour aquaculture, volaille et élevage porcin. Conseil pour les bovins, devis et livraison au Cameroun depuis Yaoundé.",
    robots: { index: false, follow: false },
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const locale = jar.get("anc_locale")?.value === "en" ? "en" : "fr";
  const theme = jar.get("anc_theme")?.value === "dark" ? "dark" : "light";
  return (
    <html lang={locale} data-theme={theme} className={geist.variable}>
      <body>
        <Shell locale={locale} theme={theme}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
