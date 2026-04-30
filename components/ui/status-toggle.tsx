'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import type { ActionResult } from '@/src/types/actions';

interface StatusToggleProps {
  checked: boolean;
  onToggle: (active: boolean) => Promise<ActionResult>;
}

export function StatusToggle({ checked: initialChecked, onToggle }: StatusToggleProps) {
  const [checked, setChecked] = useState(initialChecked);
  const [, startTransition] = useTransition();

  function handleChange(value: boolean) {
    const prev = checked;
    setChecked(value);
    startTransition(async () => {
      const result = await onToggle(value);
      if ('error' in result) setChecked(prev);
    });
  }

  return <Switch checked={checked} onCheckedChange={handleChange} aria-label="Cambiar estado" />;
}
