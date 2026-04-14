import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'WMS - DeRocha',
  description: 'Panel de Operarios — Warehouse Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
