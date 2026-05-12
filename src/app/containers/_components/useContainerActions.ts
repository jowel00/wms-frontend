'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import {
  receiveContainerAction,
  putawayContainerAction,
  moveContainerAction,
} from '@/src/app/actions/containers';
import { formatBackendError } from '@/src/lib/formatError';
import type { InventoryContainer, Location } from '@/src/types/inventory';
import type { ReceiveFormValues, PutawayFormValues, MoveFormValues } from '@/src/lib/validations/containers';

type OptimisticAction =
  | { type: 'add';    container: InventoryContainer }
  | { type: 'update'; containerId: string; patch: Partial<InventoryContainer> };

function applyOptimistic(state: InventoryContainer[], action: OptimisticAction): InventoryContainer[] {
  if (action.type === 'add')    return [...state, action.container];
  if (action.type === 'update') return state.map((c) =>
    c.containerId === action.containerId ? { ...c, ...action.patch } : c
  );
  return state;
}

export function useContainerActions(
  containers: InventoryContainer[],
  locations: Location[]
) {
  const [, startTransition] = useTransition();
  const [optimisticContainers, dispatch] = useOptimistic(containers, applyOptimistic);

  function handleReceive(data: ReceiveFormValues) {
    const temp: InventoryContainer = {
      containerId: `opt-${Date.now()}`,
      ownerId:     data.ownerId,
      warehouseId: data.warehouseId,
      locationId:  null,
      type:        'BOX',
      status:      'CREATED',
    };
    startTransition(async () => {
      dispatch({ type: 'add', container: temp });
      const result = await receiveContainerAction(data);
      if ('error' in result) toast.error(formatBackendError(result.error));
      else toast.success('Contenedor recibido — pendiente de putaway');
    });
  }

  function handlePutaway(containerId: string, data: PutawayFormValues) {
    startTransition(async () => {
      dispatch({ type: 'update', containerId, patch: { locationId: data.locationId, status: 'ACTIVE' } });
      const result = await putawayContainerAction(containerId, data);
      if ('error' in result) toast.error(formatBackendError(result.error));
      else {
        const bin = locations.find((l) => l.locationId === data.locationId);
        toast.success(`Putaway confirmado${bin ? ` — ${bin.code}` : ''}`);
      }
    });
  }

  function handleMove(containerId: string, data: MoveFormValues) {
    startTransition(async () => {
      dispatch({ type: 'update', containerId, patch: { locationId: data.toLocationId } });
      const result = await moveContainerAction(containerId, data);
      if ('error' in result) toast.error(formatBackendError(result.error));
      else {
        const bin = locations.find((l) => l.locationId === data.toLocationId);
        toast.success(`Contenedor movido${bin ? ` → ${bin.code}` : ''}`);
      }
    });
  }

  return { optimisticContainers, handleReceive, handlePutaway, handleMove };
}
