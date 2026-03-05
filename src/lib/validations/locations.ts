import { z } from 'zod';

export const locationSchema = z.object({
  code: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  type: z.enum(['RACK', 'BIN', 'STAGING', 'PACKING', 'RETURNS']),
  aisle: z.string().max(20).optional(),
  rack: z.string().max(20).optional(),
  bin: z.string().max(20).optional(),
  warehouseId: z.string().uuid('Selecciona una bodega válida'),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
