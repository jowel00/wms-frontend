import { z } from 'zod';

export const ownerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
});

export type OwnerFormValues = z.infer<typeof ownerSchema>;
