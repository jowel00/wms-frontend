import { useState, useMemo } from 'react';
import type { Location } from '@/src/types/inventory';

export function useLocations(locations: Location[], initialSearch = '') {
  const [search, setSearch] = useState(initialSearch);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return locations;
    return locations.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        (l.aisle ?? '').toLowerCase().includes(q) ||
        (l.rack ?? '').toLowerCase().includes(q) ||
        (l.bin ?? '').toLowerCase().includes(q)
    );
  }, [locations, search]);

  return { search, setSearch, filtered };
}
