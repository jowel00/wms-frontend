import { useState } from 'react';
import type { Owner } from '@/src/types/inventory';

export function useOwners(owners: Owner[], initialSearch = '') {
  const [search, setSearch] = useState(initialSearch);

  const q = search.toLowerCase();
  const filtered = !q ? owners : owners.filter((o) => o.name.toLowerCase().includes(q));

  return { search, setSearch, filtered };
}
