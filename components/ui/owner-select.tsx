'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Owner } from '@/src/types/inventory';

interface OwnerSelectProps {
  owners: Owner[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  allLabel?: string;
}

export function OwnerSelect({
  owners,
  value,
  onChange,
  className,
  allLabel = 'Todos los owners',
}: OwnerSelectProps) {
  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');

  return (
    <Select
      value={value || '__all__'}
      onValueChange={(v) => onChange(v === '__all__' ? '' : v)}
    >
      <SelectTrigger className={cn('h-14 text-base', className)}>
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__" className="text-base py-3">
          {allLabel}
        </SelectItem>
        {activeOwners.map((o) => (
          <SelectItem key={o.ownerId} value={o.ownerId} className="text-base py-3">
            {o.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
