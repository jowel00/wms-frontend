import { z } from 'zod';

// RECEIVE — crea contenedor + primera línea sin ubicación
export const receiveSchema = z.object({
  ownerId:     z.string().uuid('Selecciona un owner válido'),
  warehouseId: z.string().uuid('Selecciona una bodega válida'),
  typeId:      z.string().uuid('Selecciona un tipo de contenedor válido'),
  productId:   z.string().uuid('Selecciona un producto válido'),
  quantity:    z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
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
