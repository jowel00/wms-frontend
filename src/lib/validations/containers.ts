import { z } from 'zod';

export const containerSchema = z.object({
  ownerId: z.string().uuid('Selecciona un owner válido'),
  warehouseId: z.string().uuid('Selecciona una bodega válida'),
  locationId: z.string().uuid('Selecciona una ubicación válida'),
  type: z.string().min(1, 'El tipo de contenedor es requerido'),
});

export type ContainerFormValues = z.infer<typeof containerSchema>;
