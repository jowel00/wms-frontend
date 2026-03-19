import { z } from 'zod';

export const warehouseSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  city: z.string().min(2, 'Selecciona una ciudad'),
  countryCode: z.literal('CO'),
  ownerId: z.string().uuid('Selecciona un owner válido'),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;
