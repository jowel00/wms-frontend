'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ownerSchema, type OwnerFormValues } from '@/src/lib/validations/owners';
import type { Owner } from '@/src/types/inventory';

interface OwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner?: Owner | null;
  onSubmit: (data: OwnerFormValues) => void;
}

export function OwnerDialog({ open, onOpenChange, owner, onSubmit }: OwnerDialogProps) {
  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) form.reset({ name: owner?.name ?? '' });
  }, [open, owner, form]);

  function handleSubmit(data: OwnerFormValues) {
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {owner ? 'Editar Owner' : 'Nuevo Owner'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Distribuidora Colombia S.A.S"
                      className="h-14 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-12 px-6 text-base"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-12 px-8 text-base font-bold uppercase tracking-wider"
              >
                {owner ? 'Guardar cambios' : 'Crear owner'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
