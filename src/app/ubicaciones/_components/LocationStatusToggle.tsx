'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleLocationStatus } from '@/src/app/actions/locations';

interface LocationStatusToggleProps {
  locationId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export function LocationStatusToggle({ locationId, status }: LocationStatusToggleProps) {
  const [checked, setChecked] = useState(status === 'ACTIVE');
  const [, startTransition] = useTransition();

  function handleChange(value: boolean) {
    const prev = checked;
    setChecked(value);
    startTransition(async () => {
      const result = await toggleLocationStatus(locationId, value ? 'ACTIVE' : 'INACTIVE');
      if ('error' in result) {
        setChecked(prev);
      }
    });
  }

  return <Switch checked={checked} onCheckedChange={handleChange} aria-label="Cambiar estado" />;
}
