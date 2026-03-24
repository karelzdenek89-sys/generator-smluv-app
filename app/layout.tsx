import type { Metadata } from "next";
import "./globals.css"; // Zajišťuje, že funguje Tailwind a naše animace

export const metadata: Metadata = {
  title: "SmlouvaHned | Neprůstřelné právní smlouvy",
  description: "Vygenerujte si právně bezpečnou smlouvu na auto nebo nájem za 3 minuty. Aktualizováno pro legislativu 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      {/* antialiased vyhladí písmo, aby vypadalo víc jako na Macu/iPhonech */}
      <body className="antialiased bg-[#0a0f1c] text-slate-200">
        {/* Zde se vykreslí naše hlavní stránka (page.tsx) */}
        {children}
      </body>
    </html>
  );
}