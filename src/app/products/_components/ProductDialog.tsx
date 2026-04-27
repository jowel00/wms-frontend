'use client';

import { useEffect } from 'react';
import { Building2 } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { productSchema, type ProductFormValues } from '@/src/lib/validations/products';
import type { Owner } from '@/src/types/inventory';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owners: Owner[];
  onSubmit: (data: ProductFormValues) => void;
  /** Cuando se provee, el campo owner se muestra bloqueado con este valor */
  lockedOwnerId?: string;
  lockedOwnerName?: string;
}

export function ProductDialog({
  open,
  onOpenChange,
  owners,
  onSubmit,
  lockedOwnerId,
  lockedOwnerName,
}: ProductDialogProps) {
  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ownerId: lockedOwnerId ?? '',
      sellerSku: '',
      name: '',
      barcodeUpcEan: '',
      requiresUnitTracking: false,
      hasExpiration: false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        ownerId: lockedOwnerId ?? '',
        sellerSku: '',
        name: '',
        barcodeUpcEan: '',
        requiresUnitTracking: false,
        hasExpiration: false,
      });
    }
  }, [open, form, lockedOwnerId]);

  function handleSubmit(data: ProductFormValues) {
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nuevo Producto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Owner — bloqueado si ya viene seleccionado desde la vista */}
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Owner</FormLabel>
                  {lockedOwnerId ? (
                    <div className="flex items-center gap-3 h-14 px-4 rounded-md border border-border bg-muted/50">
                      <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-base font-medium text-foreground flex-1 truncate">
                        {lockedOwnerName ?? lockedOwnerId}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                        Seleccionado
                      </span>
                    </div>
                  ) : (
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
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SKU */}
            <FormField
              control={form.control}
              name="sellerSku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">SKU / Código del seller</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: SKU-001"
                      className="h-14 text-base font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Nombre del producto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Camiseta talla M azul"
                      className="h-14 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código de barras (opcional) */}
            <FormField
              control={form.control}
              name="barcodeUpcEan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Código de barras{' '}
                    <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="UPC / EAN"
                      className="h-14 text-base font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Switches */}
            <div className="rounded-lg border border-border divide-y divide-border">
              <FormField
                control={form.control}
                name="requiresUnitTracking"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between px-4 py-4 gap-4">
                    <div>
                      <FormLabel className="text-base font-semibold cursor-pointer">
                        Trazabilidad por unidad
                      </FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Cada unidad se rastrea individualmente (nro. de serie, IMEI, etc.)
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasExpiration"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between px-4 py-4 gap-4">
                    <div>
                      <FormLabel className="text-base font-semibold cursor-pointer">
                        Tiene fecha de vencimiento
                      </FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Se registrará y controlará la fecha de expiración
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                Crear producto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
