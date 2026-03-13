// Reflejo de la V002 y la Entidad Product
export interface Product {
  productId: string; // UUID
  sellerSku: string;
  name: string;
  barcodeUpcEan?: string;
  status: 'ACTIVE' | 'INACTIVE';
  hasExpiration: boolean;
}

export interface Owner {
  ownerId: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  skuCount?: number;
}

export interface Warehouse {
  warehouseId: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  ownerId: string;
  ownerName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type LocationType = 'PASILLO' | 'RACK' | 'BIN';

export interface Location {
  locationId: string;
  warehouseId: string;
  type: LocationType;
  code: string;
  parentLocationId: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

// Para la HU de Carga Masiva
export interface BulkUploadResponse {
  count: number;
  message: string;
}