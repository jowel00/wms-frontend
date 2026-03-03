import type { BulkUploadResponse } from '@/src/types/inventory';

export class BulkUploadError extends Error {
  constructor(public readonly payload: unknown) {
    super('BulkUploadError');
    this.name = 'BulkUploadError';
  }
}

export async function bulkUpload(file: File): Promise<BulkUploadResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');

  const body = new FormData();
  body.append('file', file);

  const response = await fetch(`${apiUrl}/products/bulk-upload`, {
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
