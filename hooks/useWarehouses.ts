import { useState } from 'react';
import type { Warehouse } from '@/src/types/inventory';

export function useWarehouses(
  warehouses: Warehouse[],
  initialSearch = '',
  initialOwnerFilter = ''
) {
  const [search, setSearch] = useState(initialSearch);
  const [ownerFilter, setOwnerFilter] = useState(initialOwnerFilter);

  const q = search.toLowerCase();
  const filtered = warehouses.filter((w) => {
    const matchesSearch =
      !q ||
      w.name.toLowerCase().includes(q) ||
      w.city.toLowerCase().includes(q) ||
      w.countryCode.toLowerCase().includes(q);
    const matchesOwner = !ownerFilter || w.ownerId === ownerFilter;
    return matchesSearch && matchesOwner;
  });

  return { search, setSearch, ownerFilter, setOwnerFilter, filtered };
}
