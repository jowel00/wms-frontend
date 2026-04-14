'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleWarehouseStatus } from '@/src/app/actions/warehouses';

interface BodegaStatusToggleProps {
  warehouseId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export function BodegaStatusToggle({ warehouseId, status }: BodegaStatusToggleProps) {
  const [checked, setChecked] = useState(status === 'ACTIVE');
  const [, startTransition] = useTransition();

  function handleChange(value: boolean) {
    const prev = checked;
    setChecked(value);
    startTransition(async () => {
      const result = await toggleWarehouseStatus(warehouseId, value ? 'ACTIVE' : 'INACTIVE');
      if ('error' in result) {
        setChecked(prev);
      }
    });
  }

  return <Switch checked={checked} onCheckedChange={handleChange} aria-label="Cambiar estado" />;
}
