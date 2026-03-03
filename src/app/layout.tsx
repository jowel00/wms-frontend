import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WMS - DeRocha',
  description: 'Panel de Operarios — Warehouse Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
