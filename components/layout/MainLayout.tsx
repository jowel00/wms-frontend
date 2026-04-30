'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar colapsable — sólo desktop (hidden en móvil dentro del componente) */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />

        {/* Contenido principal
            pt-16 en móvil deja espacio a la top bar fija de MobileNav */}
        <main className="flex-1 overflow-auto pt-16 md:pt-0">
          {children}
        </main>
      </div>

      {/* Navegación móvil: top bar + menú pantalla completa */}
      <MobileNav />
    </TooltipProvider>
  );
}
