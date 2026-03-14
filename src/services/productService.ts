import type { BulkUploadResponse } from '@/src/types/inventory';

export class BulkUploadError extends Error {
  constructor(public readonly payload: unknown) {
    super('BulkUploadError');
    this.name = 'BulkUploadError';
  }
}

export async function bulkUpload(ownerId: string, file: File): Promise<BulkUploadResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');

  const body = new FormData();
  body.append('file', file);

  // El backend requiere ownerId como query param: POST /api/v1/products/bulk-upload?ownerId=UUID
  const response = await fetch(`${apiUrl}/products/bulk-upload?ownerId=${ownerId}`, {
    method: 'POST',
    body,
  });

  if (response.ok) {
    return response.json() as Promise<BulkUploadResponse>;
  }

  if (response.status === 400) {
    const payload = await response.json().catch(() => ({
      message: 'El servidor rechazó el archivo pero no devolvió detalles.',
    }));
    throw new BulkUploadError(payload);
  }

  throw new Error(`Error inesperado del servidor: HTTP ${response.status}`);
}
