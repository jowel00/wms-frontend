import { z } from 'zod';

export const warehouseSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  city: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  country: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  countryCode: z
    .string()
    .length(2, 'Debe ser código ISO de 2 letras')
    .regex(/^[A-Za-z]{2}$/, 'Solo letras (ej: CO, MX)'),
  ownerId: z.string().uuid('Selecciona un owner válido'),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;
