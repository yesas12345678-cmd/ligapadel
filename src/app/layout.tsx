import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Liga de Pádel 2026 | Clasificación y Resultados',
  description: 'Gestión de resultados, jornadas y clasificación individual de la Liga Americana de Pádel.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-slate-950 text-slate-100 antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
