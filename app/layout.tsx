import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GridPattern from "@/components/GridPattern";
import { ThemeProvider } from "./providers";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
          />
          <div className="absolute top-4 right-4">
            <ThemeSwitcher />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}