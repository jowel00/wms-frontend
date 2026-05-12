import { z } from 'zod';

const todayStr = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

// Caso 1: lote ya existente — solo se envía el UUID
const existingLotSchema = z.object({
  lotId: z.string().uuid('Selecciona un lote válido'),
});

// Caso 2: lote nuevo (o find-or-create por batchCode+expiresAt)
const newLotSchema = z.object({
  batchCode:  z.string().min(1, 'El código de lote es requerido'),
  expiresAt:  z.string().min(1, 'La fecha de vencimiento es requerida'),
  receivedAt: z
    .string()
    .min(1, 'La fecha de recibimiento es requerida')
    .refine((v) => v >= todayStr(), 'La fecha de recibimiento no puede ser anterior a hoy'),
}).refine(
  (d) => d.expiresAt > d.receivedAt,
  { message: 'La fecha de vencimiento debe ser posterior a la de recibimiento', path: ['expiresAt'] }
);

const lotSectionSchema = z.union([existingLotSchema, newLotSchema]);

// RECEIVE — crea contenedor + primera línea sin ubicación
export const receiveSchema = z.object({
  ownerId:     z.string().uuid('Selecciona un owner válido'),
  warehouseId: z.string().uuid('Selecciona una bodega válida'),
  typeId:      z.string().uuid('Selecciona un tipo de contenedor válido'),
  productId:   z.string().uuid('Selecciona un producto válido'),
  quantity:    z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
  lot:         lotSectionSchema.optional(),
});

// PUTAWAY — asigna ubicación a un contenedor CREATED
export const putawaySchema = z.object({
  locationId: z.string().uuid('Selecciona una ubicación válida'),
});

// MOVE — mueve contenedor a otra ubicación
export const moveSchema = z.object({
  toLocationId: z.string().uuid('Selecciona una ubicación destino válida'),
});

export type ReceiveFormValues  = z.infer<typeof receiveSchema>;
export type PutawayFormValues  = z.infer<typeof putawaySchema>;
export type MoveFormValues     = z.infer<typeof moveSchema>;
