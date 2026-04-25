import { z } from 'zod';

export const containerLineSchema = z.object({
  productId: z.string().uuid('Selecciona un producto válido'),
  lotId: z.string().uuid('Selecciona un lote válido').optional(),
  qtyTotal: z
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser mayor a 0'),
});

export type ContainerLineFormValues = z.infer<typeof containerLineSchema>;
