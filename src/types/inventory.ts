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

export type LocationType = 'RACK' | 'BIN' | 'STAGING' | 'PACKING' | 'RETURNS';

export interface Location {
  locationId: string;
  code: string;
  type: LocationType;
  aisle?: string;
  rack?: string;
  bin?: string;
  warehouseId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Para la HU de Carga Masiva
export interface BulkUploadResponse {
  count: number;
  message: string;
}