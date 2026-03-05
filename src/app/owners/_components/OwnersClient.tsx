'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Users, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { EmptyState } from '@/components/ui/empty-state';
import { useOwners } from '@/hooks/useOwners';
import { createOwner, updateOwner } from '@/src/app/actions/owners';
import { OwnersTable } from './OwnersTable';
import type { Owner } from '@/src/types/inventory';
import type { OwnerFormValues } from '@/src/lib/validations/owners';

// Lazy-load the dialog — only ships when user clicks "Nuevo owner"
const OwnerDialog = dynamic(
  () => import('./OwnerDialog').then((m) => m.OwnerDialog),
  { loading: () => null }
);

type OptimisticAction =
  | { type: 'add'; owner: Owner }
  | { type: 'update'; owner: Owner };

interface OwnersClientProps {
  owners: Owner[];
  initialSearch: string;
}

function OwnersClientInner({ owners, initialSearch }: OwnersClientProps) {
  const [searchPending, startSearchTransition] = useTransition();
  const [actionPending, startActionTransition] = useTransition();

  const [optimisticOwners, dispatchOptimistic] = useOptimistic(
    owners,
    (state: Owner[], action: OptimisticAction) => {
      if (action.type === 'add') return [...state, action.owner];
      return state.map((o) => (o.ownerId === action.owner.ownerId ? action.owner : o));
    }
  );

  // Hook recibe la lista optimista — un único useState interno maneja el search
  const { search, setSearch, filtered: optimisticFiltered } = useOwners(optimisticOwners, initialSearch);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function handleSearch(value: string) {
    startSearchTransition(() => setSearch(value));
  }

  function openCreate() {
    setEditingOwner(null);
    setActionError(null);
    setDialogOpen(true);
  }

  function openEdit(owner: Owner) {
    setEditingOwner(owner);
    setActionError(null);
    setDialogOpen(true);
  }

  function handleSubmit(data: OwnerFormValues) {
    setActionError(null);

    if (editingOwner) {
      const updated: Owner = { ...editingOwner, name: data.name };
      startActionTransition(async () => {
        dispatchOptimistic({ type: 'update', owner: updated });
        const result = await updateOwner(editingOwner.ownerId, data);
        if ('error' in result) setActionError(result.error);
      });
    } else {
      const temp: Owner = {
        ownerId: `opt-${Date.now()}`,
        name: data.name,
        status: 'ACTIVE',
      };
      startActionTransition(async () => {
        dispatchOptimistic({ type: 'add', owner: temp });
        const result = await createOwner(data);
        if ('error' in result) setActionError(result.error);
      });
    }
  }

  return (
    <>
      {actionError && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Buscar owner..."
          isPending={searchPending}
          className="w-72"
        />
        <Button
          onClick={openCreate}
          className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Nuevo owner
        </Button>
      </div>

      {optimisticFiltered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No se encontraron owners"
          description={
            search
              ? `Sin resultados para "${search}". Intenta con otro nombre.`
              : 'Aún no hay owners registrados. Crea el primero para comenzar.'
          }
          action={!search ? { label: '+ Agregar el primero', onClick: openCreate } : undefined}
        />
      ) : (
        <OwnersTable owners={optimisticFiltered} onEdit={openEdit} />
      )}

      <OwnerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        owner={editingOwner}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export function OwnersClient(props: OwnersClientProps) {
  return (
    <Suspense>
      <OwnersClientInner {...props} />
    </Suspense>
  );
}
