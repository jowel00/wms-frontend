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

export const MOCK_LOCATIONS: Location[] = [
  // Bodega Principal Bogotá (wh-001)
  { locationId: 'loc-001', code: 'A-01-001', type: 'RACK',    aisle: 'A', rack: '01', bin: '001', warehouseId: 'wh-001', status: 'ACTIVE' },
  { locationId: 'loc-002', code: 'A-01-002', type: 'RACK',    aisle: 'A', rack: '01', bin: '002', warehouseId: 'wh-001', status: 'ACTIVE' },
  { locationId: 'loc-003', code: 'A-02-001', type: 'RACK',    aisle: 'A', rack: '02', bin: '001', warehouseId: 'wh-001', status: 'ACTIVE' },
  { locationId: 'loc-004', code: 'B-01-001', type: 'BIN',     aisle: 'B', rack: '01', bin: '001', warehouseId: 'wh-001', status: 'ACTIVE' },
  { locationId: 'loc-005', code: 'B-01-002', type: 'BIN',     aisle: 'B', rack: '01', bin: '002', warehouseId: 'wh-001', status: 'INACTIVE' },
  { locationId: 'loc-006', code: 'STG-01',   type: 'STAGING', warehouseId: 'wh-001', status: 'ACTIVE' },
  { locationId: 'loc-007', code: 'PACK-01',  type: 'PACKING', warehouseId: 'wh-001', status: 'ACTIVE' },
  { locationId: 'loc-008', code: 'DEV-01',   type: 'RETURNS', warehouseId: 'wh-001', status: 'ACTIVE' },

  // Centro de Distribución Medellín (wh-002)
  { locationId: 'loc-009', code: 'A-01-001', type: 'RACK',    aisle: 'A', rack: '01', bin: '001', warehouseId: 'wh-002', status: 'ACTIVE' },
  { locationId: 'loc-010', code: 'A-01-002', type: 'RACK',    aisle: 'A', rack: '01', bin: '002', warehouseId: 'wh-002', status: 'ACTIVE' },
  { locationId: 'loc-011', code: 'C-03-001', type: 'RACK',    aisle: 'C', rack: '03', bin: '001', warehouseId: 'wh-002', status: 'ACTIVE' },
  { locationId: 'loc-012', code: 'STG-01',   type: 'STAGING', warehouseId: 'wh-002', status: 'ACTIVE' },
  { locationId: 'loc-013', code: 'DEV-01',   type: 'RETURNS', warehouseId: 'wh-002', status: 'ACTIVE' },

  // Bodega Cali Industrial (wh-004)
  { locationId: 'loc-014', code: 'A-01-001', type: 'RACK',    aisle: 'A', rack: '01', bin: '001', warehouseId: 'wh-004', status: 'ACTIVE' },
  { locationId: 'loc-015', code: 'PACK-01',  type: 'PACKING', warehouseId: 'wh-004', status: 'ACTIVE' },
];
