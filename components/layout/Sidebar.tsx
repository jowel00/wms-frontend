'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Warehouse,
  MapPin,
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const NAV_MAIN = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Owners', href: '/owners', icon: Users },
  { label: 'Bodegas', href: '/bodegas', icon: Warehouse },
  { label: 'Ubicaciones', href: '/ubicaciones', icon: MapPin },
] as const;

const NAV_OPERATIONS = [
  { label: 'Carga Masiva', href: '/products/bulk-upload', icon: Upload },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-r border-sidebar-border shrink-0',
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border shrink-0',
          collapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <span className="text-2xl shrink-0" aria-hidden="true">📦</span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-widest leading-none">
              De Rocha
            </p>
            <p className="text-sm font-black text-white uppercase tracking-wide leading-tight mt-0.5">
              Store
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Navegación principal">
        <NavSection
          items={NAV_MAIN}
          collapsed={collapsed}
          pathname={pathname}
        />

        <div className="px-3 py-3">
          <Separator className="bg-sidebar-border opacity-60" />
        </div>

        {!collapsed && (
          <p className="px-4 pb-2 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-widest">
            Operaciones
          </p>
        )}

        <NavSection
          items={NAV_OPERATIONS}
          collapsed={collapsed}
          pathname={pathname}
        />
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          className={cn(
            'flex items-center w-full h-9 rounded-md px-2',
            'text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent',
            'transition-colors',
            collapsed ? 'justify-center' : 'gap-2'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

type NavItem = { label: string; href: string; icon: React.ElementType };

interface NavSectionProps {
  items: readonly NavItem[];
  collapsed: boolean;
  pathname: string;
}

function NavSection({ items, collapsed, pathname }: NavSectionProps) {
  return (
    <ul className="space-y-0.5 px-2" role="list">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        const linkEl = (
          <Link
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group relative flex items-center rounded-md text-sm font-medium',
              'transition-colors min-h-[44px]',
              collapsed ? 'justify-center px-0 w-full' : 'gap-3 px-3',
              isActive
                ? 'bg-sidebar-primary/10 text-white'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
            )}
          >
            {/* Zone-rail: signature element — warehouse floor tape */}
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
