'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_MAIN, NAV_OPERATIONS } from './navConfig';

const ALL_NAV = [...NAV_MAIN, ...NAV_OPERATIONS];

function getPageName(pathname: string): string {
  const exact = ALL_NAV.find((item) => item.href === pathname);
  if (exact) return exact.pageName;
  const prefix = ALL_NAV.find((item) => item.href !== '/' && pathname.startsWith(item.href));
  if (prefix) return prefix.pageName;
  return 'WMS';
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cerrar al cambiar de ruta
  useEffect(() => { setOpen(false); }, [pathname]);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const pageName = getPageName(pathname);

  return (
    <>
      {/* ── Top bar (móvil only) ──────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 md:hidden z-40 flex items-center h-16 px-4 bg-sidebar border-b border-sidebar-border shrink-0">
        {/* Logo */}
        <span className="text-xl mr-3" aria-hidden="true">📦</span>

        {/* Nombre de página actual */}
        <p className="flex-1 text-sm font-black text-white uppercase tracking-wide truncate">
          {pageName}
        </p>

        {/* Botón MENÚ — grande para guantes */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          className={cn(
            'flex items-center gap-2 h-12 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-colors',
            open
              ? 'bg-white/10 text-white'
              : 'bg-sidebar-primary text-white active:bg-sidebar-primary/80'
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>{open ? 'Cerrar' : 'Menú'}</span>
        </button>
      </header>

      {/* ── Menú pantalla completa ───────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-background pt-16 overflow-y-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Cuadrícula 2 columnas — tiles grandes, fáciles con guantes */}
          <div className="grid grid-cols-2 gap-3 p-4">
            {NAV_MAIN.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 rounded-2xl p-6 min-h-[120px]',
                    'transition-colors active:scale-95',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card border border-border text-foreground hover:bg-primary/10'
                  )}
                >
                  <Icon className="h-9 w-9 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm font-black uppercase tracking-wider text-center leading-tight">
                    {item.tileLabel ?? item.pageName}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Operaciones — separado abajo */}
          <div className="px-4 pb-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
              Operaciones
            </p>
            <div className="grid grid-cols-2 gap-3">
              {NAV_OPERATIONS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center gap-3 rounded-2xl p-6 min-h-[100px]',
                      'transition-colors active:scale-95',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card border border-border text-foreground hover:bg-primary/10'
                    )}
                  >
                    <Icon className="h-8 w-8 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-black uppercase tracking-wider text-center leading-tight">
                      {item.tileLabel ?? item.pageName}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
