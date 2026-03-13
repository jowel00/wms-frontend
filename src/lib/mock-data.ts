import type { Owner, Warehouse, Location } from '@/src/types/inventory';

export const MOCK_OWNERS: Owner[] = [
  {
    ownerId: 'owner-001',
    name: 'Distribuidora Colombia S.A.S',
    status: 'ACTIVE',
    skuCount: 45,
  },
  {
    ownerId: 'owner-002',
    name: 'Grupo Industrial Andino',
    status: 'ACTIVE',
    skuCount: 128,
  },
  {
    ownerId: 'owner-003',
    name: 'Importaciones del Caribe Ltda',
    status: 'INACTIVE',
    skuCount: 0,
  },
  {
    ownerId: 'owner-004',
    name: 'TechParts Colombia',
    status: 'ACTIVE',
    skuCount: 67,
  },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    warehouseId: 'wh-001',
    name: 'Bodega Principal Bogotá',
    city: 'Bogotá',
    country: 'Colombia',
    countryCode: 'CO',
    ownerId: 'owner-001',
    ownerName: 'Distribuidora Colombia S.A.S',
    status: 'ACTIVE',
  },
  {
    warehouseId: 'wh-002',
    name: 'Centro de Distribución Medellín',
    city: 'Medellín',
    country: 'Colombia',
    countryCode: 'CO',
    ownerId: 'owner-002',
    ownerName: 'Grupo Industrial Andino',
    status: 'ACTIVE',
  },
  {
    warehouseId: 'wh-003',
    name: 'Almacén Barranquilla Norte',
    city: 'Barranquilla',
    country: 'Colombia',
    countryCode: 'CO',
    ownerId: 'owner-003',
    ownerName: 'Importaciones del Caribe Ltda',
    status: 'INACTIVE',
  },
  {
    warehouseId: 'wh-004',
    name: 'Bodega Cali Industrial',
    city: 'Cali',
    country: 'Colombia',
    countryCode: 'CO',
    ownerId: 'owner-004',
    ownerName: 'TechParts Colombia',
    status: 'ACTIVE',
  },
  {
    warehouseId: 'wh-005',
    name: 'Hub Logístico Bucaramanga',
    city: 'Bucaramanga',
    country: 'Colombia',
    countryCode: 'CO',
    ownerId: 'owner-002',
    ownerName: 'Grupo Industrial Andino',
    status: 'ACTIVE',
  },
];

// Jerarquía: PASILLO → RACK → BIN
// parentLocationId = null → PASILLO (top-level de bodega)
// parentLocationId = aisleId → RACK
// parentLocationId = rackId  → BIN
export const MOCK_LOCATIONS: Location[] = [
  // ── wh-001: Bodega Principal Bogotá ──────────────────────────────
  // Pasillos
  { locationId: 'loc-p01', warehouseId: 'wh-001', type: 'PASILLO', code: 'P-0001', parentLocationId: null, status: 'ACTIVE' },
  { locationId: 'loc-p02', warehouseId: 'wh-001', type: 'PASILLO', code: 'P-0002', parentLocationId: null, status: 'ACTIVE' },
  { locationId: 'loc-p03', warehouseId: 'wh-001', type: 'PASILLO', code: 'P-0003', parentLocationId: null, status: 'INACTIVE' },
  // Racks de P-0001
  { locationId: 'loc-r01', warehouseId: 'wh-001', type: 'RACK', code: 'R-0001', parentLocationId: 'loc-p01', status: 'ACTIVE' },
  { locationId: 'loc-r02', warehouseId: 'wh-001', type: 'RACK', code: 'R-0002', parentLocationId: 'loc-p01', status: 'ACTIVE' },
  { locationId: 'loc-r03', warehouseId: 'wh-001', type: 'RACK', code: 'R-0003', parentLocationId: 'loc-p01', status: 'INACTIVE' },
  // Racks de P-0002
  { locationId: 'loc-r04', warehouseId: 'wh-001', type: 'RACK', code: 'R-0001', parentLocationId: 'loc-p02', status: 'ACTIVE' },
  // Bins de R-0001 (loc-r01)
  { locationId: 'loc-b01', warehouseId: 'wh-001', type: 'BIN', code: 'B-0001', parentLocationId: 'loc-r01', status: 'ACTIVE' },
  { locationId: 'loc-b02', warehouseId: 'wh-001', type: 'BIN', code: 'B-0002', parentLocationId: 'loc-r01', status: 'ACTIVE' },
  { locationId: 'loc-b03', warehouseId: 'wh-001', type: 'BIN', code: 'B-0003', parentLocationId: 'loc-r01', status: 'INACTIVE' },
  // Bins de R-0002 (loc-r02)
  { locationId: 'loc-b04', warehouseId: 'wh-001', type: 'BIN', code: 'B-0001', parentLocationId: 'loc-r02', status: 'ACTIVE' },
  // Bins de R-0001 (loc-r04, de P-0002)
  { locationId: 'loc-b05', warehouseId: 'wh-001', type: 'BIN', code: 'B-0001', parentLocationId: 'loc-r04', status: 'ACTIVE' },

  // ── wh-002: Centro de Distribución Medellín ──────────────────────
  // Pasillos
  { locationId: 'loc-p04', warehouseId: 'wh-002', type: 'PASILLO', code: 'P-0001', parentLocationId: null, status: 'ACTIVE' },
  { locationId: 'loc-p05', warehouseId: 'wh-002', type: 'PASILLO', code: 'P-0002', parentLocationId: null, status: 'INACTIVE' },
  // Racks de P-0001 (wh-002)
  { locationId: 'loc-r05', warehouseId: 'wh-002', type: 'RACK', code: 'R-0001', parentLocationId: 'loc-p04', status: 'ACTIVE' },
  // Bins de R-0001 (loc-r05)
  { locationId: 'loc-b06', warehouseId: 'wh-002', type: 'BIN', code: 'B-0001', parentLocationId: 'loc-r05', status: 'ACTIVE' },
  { locationId: 'loc-b07', warehouseId: 'wh-002', type: 'BIN', code: 'B-0002', parentLocationId: 'loc-r05', status: 'ACTIVE' },
];
