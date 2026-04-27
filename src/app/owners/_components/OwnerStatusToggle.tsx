'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleOwnerStatus } from '@/src/app/actions/owners';

interface OwnerStatusToggleProps {
  ownerId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export function OwnerStatusToggle({ ownerId, status }: OwnerStatusToggleProps) {
  const [checked, setChecked] = useState(status === 'ACTIVE');
  const [, startTransition] = useTransition();

  function handleChange(value: boolean) {
    const prev = checked;
    setChecked(value);
    startTransition(async () => {
      const result = await toggleOwnerStatus(ownerId, value ? 'ACTIVE' : 'INACTIVE');
      if ('error' in result) {
        setChecked(prev);
      }
    });
  }

  return <Switch checked={checked} onCheckedChange={handleChange} aria-label="Cambiar estado" />;
}
