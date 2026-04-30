'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Building2, ChevronRight, Search } from 'lucide-react';
import type { Owner } from '@/src/types/inventory';

interface OwnerGateProps {
  owners: Owner[];
}

export function OwnerGate({ owners }: OwnerGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');
  const filtered = search.trim()
    ? activeOwners.filter((o) =>
        o.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : activeOwners;

  function selectOwner(ownerId: string) {
    router.push(`${pathname}?ownerId=${ownerId}&page=1`);
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
        <Building2 className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-black text-foreground uppercase tracking-wide text-center">
        Selecciona un owner
      </h2>
      <p className="text-base text-muted-foreground mt-2 mb-8 text-center max-w-md">
        Los productos están organizados por owner. Elige uno para ver y gestionar su catálogo.
      </p>

      {activeOwners.length > 0 && (
        <div className="relative w-full max-w-3xl mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar owner..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}

      {activeOwners.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay owners activos registrados.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No se encontró ningún owner con ese nombre.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {filtered.map((owner) => (
            <li key={owner.ownerId}>
              <button
                type="button"
                onClick={() => selectOwner(owner.ownerId)}
                className="group w-full flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-card px-5 py-4 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0 transition-colors group-hover:bg-primary/20">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-snug break-words whitespace-normal">
                    {owner.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
