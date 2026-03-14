import { z } from 'zod';

export const locationSchema = z.object({
  warehouseId: z.string().uuid('Selecciona una bodega válida'),
  type: z.enum(['PASILLO', 'RACK', 'BIN']),
  code: z.string().min(1, 'El código es requerido'),
  parentLocationId: z.string().uuid().nullable().optional(),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
