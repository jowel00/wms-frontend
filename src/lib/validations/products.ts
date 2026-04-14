import { z } from 'zod';

export const productSchema = z.object({
  ownerId: z.string().uuid('Selecciona un owner válido'),
  sellerSku: z
    .string()
    .min(1, 'El SKU es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  name: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  barcodeUpcEan: z
    .string()
    .max(50, 'Máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  requiresUnitTracking: z.boolean(),
  hasExpiration: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
