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
import { locationSchema, type LocationFormValues } from '@/src/lib/validations/locations';
import type { Location } from '@/src/types/inventory';

const LOCATION_TYPES = ['RACK', 'BIN', 'STAGING', 'PACKING', 'RETURNS'] as const;
const TYPE_LABELS: Record<string, string> = {
  RACK: 'Rack',
  BIN: 'Bin',
  STAGING: 'Staging',
  PACKING: 'Packing',
  RETURNS: 'Devoluciones',
};

interface UbicacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: Location | null;
  warehouseId: string;
  onSubmit: (data: LocationFormValues) => void;
}

export function UbicacionDialog({
  open,
  onOpenChange,
  location,
  warehouseId,
  onSubmit,
}: UbicacionDialogProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { code: '', type: 'RACK', aisle: '', rack: '', bin: '', warehouseId },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: location?.code ?? '',
        type: location?.type ?? 'RACK',
        aisle: location?.aisle ?? '',
        rack: location?.rack ?? '',
        bin: location?.bin ?? '',
        warehouseId,
      });
    }
  }, [open, location, warehouseId, form]);

  function handleSubmit(data: LocationFormValues) {
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {location ? 'Editar Ubicación' : 'Nueva Ubicación'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: A-01-001"
                      className="h-14 text-base font-mono tracking-wider"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 text-base">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATION_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="text-base py-3">
                          {TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Jerarquía Pasillo → Rack → Bin
              </p>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="aisle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Pasillo</FormLabel>
                      <FormControl>
                        <Input placeholder="A" className="h-14 text-base font-mono text-center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Rack</FormLabel>
                      <FormControl>
                        <Input placeholder="01" className="h-14 text-base font-mono text-center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Bin</FormLabel>
                      <FormControl>
                        <Input placeholder="001" className="h-14 text-base font-mono text-center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                {location ? 'Guardar cambios' : 'Crear ubicación'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
