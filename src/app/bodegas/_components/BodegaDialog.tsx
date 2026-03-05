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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { warehouseSchema, type WarehouseFormValues } from '@/src/lib/validations/warehouses';
import type { Owner, Warehouse } from '@/src/types/inventory';

interface BodegaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse | null;
  owners: Owner[];
  onSubmit: (data: WarehouseFormValues) => void;
}

export function BodegaDialog({
  open,
  onOpenChange,
  warehouse,
  owners,
  onSubmit,
}: BodegaDialogProps) {
  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: { name: '', city: '', country: '', countryCode: '', ownerId: '' },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: warehouse?.name ?? '',
        city: warehouse?.city ?? '',
        country: warehouse?.country ?? '',
        countryCode: warehouse?.countryCode ?? '',
        ownerId: warehouse?.ownerId ?? '',
      });
    }
  }, [open, warehouse, form]);

  function handleSubmit(data: WarehouseFormValues) {
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {warehouse ? 'Editar Bodega' : 'Nueva Bodega'}
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
                      placeholder="Ej: Bodega Principal Bogotá"
                      className="h-14 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Bogotá" className="h-14 text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">País</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Colombia" className="h-14 text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Código ISO (2 letras)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: CO"
                      maxLength={2}
                      className="h-14 text-base uppercase w-28 font-mono tracking-widest"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Owner</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 text-base">
                        <SelectValue placeholder="Selecciona un owner activo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeOwners.map((o) => (
                        <SelectItem key={o.ownerId} value={o.ownerId} className="text-base py-3">
                          {o.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {warehouse ? 'Guardar cambios' : 'Crear bodega'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
