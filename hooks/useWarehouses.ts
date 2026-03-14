import { useState, useMemo } from 'react';
import type { Warehouse } from '@/src/types/inventory';

export function useWarehouses(
  warehouses: Warehouse[],
  initialSearch = '',
  initialOwnerFilter = ''
) {
  const [search, setSearch] = useState(initialSearch);
  const [ownerFilter, setOwnerFilter] = useState(initialOwnerFilter);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return warehouses.filter((w) => {
      const matchesSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        w.countryCode.toLowerCase().includes(q);
      const matchesOwner = !ownerFilter || w.ownerId === ownerFilter;
      return matchesSearch && matchesOwner;
    });
  }, [warehouses, search, ownerFilter]);

  return { search, setSearch, ownerFilter, setOwnerFilter, filtered };
}
