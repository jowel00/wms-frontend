'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  User,
  ChevronsUpDown,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { NAV_MAIN, NAV_OPERATIONS, type NavItem } from './navConfig';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Sidebar({ collapsed, onToggle, isDark, onThemeToggle }: SidebarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border shrink-0',
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      {/* ── Header: logo + collapse toggle ─────────────────────────────── */}
      <div
        className={cn(
          'flex items-center h-14 border-b border-sidebar-border shrink-0',
          collapsed ? 'justify-center px-0' : 'px-3 gap-2'
        )}
      >
        {!collapsed && (
          <>
            <span className="text-xl shrink-0" aria-hidden="true">📦</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-widest leading-none">
                De Rocha
              </p>
              <p className="text-sm font-black text-white uppercase tracking-wide leading-tight mt-0.5">
                Store
              </p>
            </div>
          </>
        )}

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Expandir panel' : 'Colapsar panel'}
              className={cn(
                'flex items-center justify-center h-8 w-8 rounded-md shrink-0',
                'text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent transition-colors'
              )}
            >
              {collapsed
                ? <ChevronRight className="h-4 w-4" />
                : <ChevronLeft className="h-4 w-4" />
              }
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-semibold">Expandir</TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Navegación principal">
        <NavSection items={NAV_MAIN} collapsed={collapsed} pathname={pathname} />

        <div className="px-3 py-3">
          <Separator className="bg-sidebar-border opacity-60" />
        </div>

        {!collapsed && (
          <p className="px-4 pb-2 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-widest">
            Operaciones
          </p>
        )}

        <NavSection items={NAV_OPERATIONS} collapsed={collapsed} pathname={pathname} />
      </nav>

      {/* ── User section ────────────────────────────────────────────────── */}
      <div ref={userMenuRef} className="relative border-t border-sidebar-border p-2 shrink-0">
        {/* Menú flotante (aparece sobre el botón) */}
        {userMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 mx-1 bg-sidebar border border-sidebar-border rounded-xl shadow-2xl overflow-hidden py-1">
            {/* Tema */}
            <button
              type="button"
              onClick={() => { onThemeToggle(); setUserMenuOpen(false); }}
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
            >
              {isDark
                ? <Sun className="h-4 w-4 shrink-0" />
                : <Moon className="h-4 w-4 shrink-0" />
              }
              <span className="font-medium">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>

            <div className="my-1 border-t border-sidebar-border" />

            {/* Configuración (futuro) */}
            <button
              type="button"
              disabled
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/30 cursor-not-allowed"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="font-medium">Configuración</span>
            </button>

            {/* Cerrar sesión (futuro) */}
            <button
              type="button"
              disabled
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/30 cursor-not-allowed"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        )}

        {/* Botón usuario */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setUserMenuOpen((p) => !p)}
              className={cn(
                'flex items-center w-full rounded-lg px-2 h-11 gap-2.5',
                'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors',
                userMenuOpen && 'bg-sidebar-accent text-white',
                collapsed && 'justify-center'
              )}
            >
              {/* Avatar */}
              <div className="h-7 w-7 rounded-full bg-sidebar-primary/40 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>

              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-white truncate leading-none">Usuario</p>
                    <p className="text-[10px] text-sidebar-foreground/50 truncate leading-none mt-0.5">
                      admin@wms.co
                    </p>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-sidebar-foreground/50 shrink-0" />
                </>
              )}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-semibold">Cuenta</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}

// ── NavSection ────────────────────────────────────────────────────────────────

interface NavSectionProps {
  items: readonly NavItem[];
  collapsed: boolean;
  pathname: string;
}

function NavSection({ items, collapsed, pathname }: NavSectionProps) {
  return (
    <ul className="space-y-0.5 px-2" role="list">
      {items.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        const Icon = item.icon;

        const linkEl = (
          <Link
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group relative flex items-center rounded-md text-sm font-medium',
              'transition-colors min-h-[40px]',
              collapsed ? 'justify-center px-0 w-full' : 'gap-3 px-3',
              isActive
                ? 'bg-sidebar-primary/10 text-white'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
            )}
          >
            {/* Zone-rail */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-sidebar-primary rounded-r-full"
              />
            )}
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );

        if (collapsed) {
          return (
            <li key={item.href}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right" className="font-semibold">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        }

        return <li key={item.href}>{linkEl}</li>;
      })}
    </ul>
  );
}
