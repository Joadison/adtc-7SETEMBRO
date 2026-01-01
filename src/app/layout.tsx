import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assembleia de Deus | ADTC 7 de Setembro",
  description:
    "Igreja Assembleia de Deus Templo Central - 7 de Setembro. Um lugar de restauração, alegria e paz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
