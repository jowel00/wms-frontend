import { z } from 'zod';

export const locationSchema = z.object({
  warehouseId: z.string().uuid('Selecciona una bodega válida'),
  typeId: z.string().uuid('Selecciona un tipo de ubicación válido'),
  typeName: z.string(),
  parentLocationId: z.string().uuid().nullable().optional(),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
