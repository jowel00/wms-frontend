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
  status: string;
}

// Para la HU de Carga Masiva
export interface BulkUploadResponse {
  count: number;
  message: string;
}