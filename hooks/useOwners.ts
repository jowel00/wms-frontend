import { useState, useMemo } from 'react';
import type { Owner } from '@/src/types/inventory';

export function useOwners(owners: Owner[], initialSearch = '') {
  const [search, setSearch] = useState(initialSearch);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return owners;
    return owners.filter((o) => o.name.toLowerCase().includes(q));
  }, [owners, search]);

  return { search, setSearch, filtered };
}
