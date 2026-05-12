import { z } from 'zod';

const localDate = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

export const lotSchema = z.object({
  ownerId:    z.string().uuid('Selecciona un owner válido'),
  productId:  z.string().uuid('Selecciona un producto válido'),
  batchCode:  z.string().min(1, 'El código de lote es requerido'),
  expiresAt:  z.string().optional(),
  receivedAt: z
    .string()
    .optional()
    .refine(
      (v) => !v || v >= localDate(),
      'La fecha de recepción no puede ser anterior a hoy'
    ),
}).refine(
  (d) => !d.expiresAt || !d.receivedAt || d.expiresAt > d.receivedAt,
  {
    message: 'La fecha de vencimiento debe ser posterior a la de recepción',
    path: ['expiresAt'],
  }
);

export type LotFormValues = z.infer<typeof lotSchema>;
