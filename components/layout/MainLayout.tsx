'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
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
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
