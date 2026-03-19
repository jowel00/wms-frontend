'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, AlertTriangle } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { warehouseSchema, type WarehouseFormValues } from '@/src/lib/validations/warehouses';
import { COLOMBIA_CITIES } from '@/src/lib/colombia-cities';
import type { Owner, Warehouse } from '@/src/types/inventory';

const MAX_WAREHOUSES_PER_OWNER = 2;

interface BodegaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse | null;
  owners: Owner[];
  warehouses: Warehouse[];
  onSubmit: (data: WarehouseFormValues) => void;
}

export function BodegaDialog({
  open,
  onOpenChange,
  warehouse,
  owners,
  warehouses,
  onSubmit,
}: BodegaDialogProps) {
  const [cityOpen, setCityOpen] = useState(false);
  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');

  const warehouseCountByOwner = warehouses.reduce<Record<string, number>>((acc, w) => {
    if (!w.warehouseId.startsWith('opt-')) {
      acc[w.ownerId] = (acc[w.ownerId] ?? 0) + 1;
    }
    return acc;
  }, {});

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: { name: '', city: '', countryCode: 'CO', ownerId: '' },
  });

  const selectedOwnerId = form.watch('ownerId');
  const selectedCity = form.watch('city');

  const ownerAtLimit =
    !!selectedOwnerId &&
    !warehouse &&
    (warehouseCountByOwner[selectedOwnerId] ?? 0) >= MAX_WAREHOUSES_PER_OWNER;

  useEffect(() => {
    if (open) {
      form.reset({
        name: warehouse?.name ?? '',
        city: warehouse?.city ?? '',
        countryCode: 'CO',
        ownerId: warehouse?.ownerId ?? '',
      });
      setCityOpen(false);
    }
  }, [open, warehouse, form]);

  function handleSubmit(data: WarehouseFormValues) {
    if (ownerAtLimit) return;
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

            {/* Ciudad — combobox con búsqueda */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-semibold">Ciudad</FormLabel>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className={cn(
                            'h-14 w-full justify-between text-base font-normal px-4',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value || 'Selecciona una ciudad'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar ciudad..." className="h-11 text-base" />
                        <CommandList>
                          <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                          <CommandGroup>
                            {COLOMBIA_CITIES.map((option) => (
                              <CommandItem
                                key={option.city}
                                value={option.city}
                                onSelect={(value) => {
                                  field.onChange(value);
                                  form.setValue('countryCode', 'CO');
                                  setCityOpen(false);
                                }}
                                className="text-base py-3 cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === option.city ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                {option.city}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* País e ISO — solo informativo, siempre Colombia / CO */}
            {selectedCity && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">País:</span>
                <span>Colombia</span>
                <span className="ml-auto">
                  <Badge variant="outline" className="font-mono uppercase tracking-widest text-sm px-2">
                    CO
                  </Badge>
                </span>
              </div>
            )}

            {/* Owner */}
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-1">
                    <FormLabel className="text-base font-semibold">Owner</FormLabel>
                    <span className="text-xs text-muted-foreground">
                      Máx. {MAX_WAREHOUSES_PER_OWNER} bodegas por owner
                    </span>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!!warehouse}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14 text-base">
                        <SelectValue placeholder="Selecciona un owner activo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeOwners.map((o) => {
                        const count = warehouseCountByOwner[o.ownerId] ?? 0;
                        const atLimit = count >= MAX_WAREHOUSES_PER_OWNER;
                        return (
                          <SelectItem
                            key={o.ownerId}
                            value={o.ownerId}
                            disabled={atLimit}
                            className="text-base py-3"
                          >
                            <span className={atLimit ? 'text-muted-foreground' : undefined}>
                              {o.name}
                            </span>
                            {atLimit && (
                              <span className="ml-2 text-xs text-destructive font-medium">
                                (límite alcanzado)
                              </span>
                            )}
                            {!atLimit && count > 0 && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({count}/{MAX_WAREHOUSES_PER_OWNER})
                              </span>
                            )}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Advertencia límite */}
            {ownerAtLimit && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Este owner ya tiene {MAX_WAREHOUSES_PER_OWNER} bodegas (límite máximo permitido).
              </div>
            )}

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
                disabled={ownerAtLimit}
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
