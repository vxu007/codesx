import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeSwitcher from "../components/ThemeSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF to DOCX Converter",
  description: "Convert PDF files to DOCX with high fidelity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-dark-bg`}>
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        {children}
      </body>
    </html>
  );
}