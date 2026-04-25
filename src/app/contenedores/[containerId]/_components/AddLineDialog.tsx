'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { containerLineSchema } from '@/src/lib/validations/containerLines';
import { queryLineProducts, queryLineLots } from '@/src/app/actions/containerLines';
import type { ProductListItem, Lot } from '@/src/types/inventory';
import type { ContainerLineFormValues } from '@/src/lib/validations/containerLines';

interface AddLineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  onSubmit: (data: ContainerLineFormValues) => void;
}

export function AddLineDialog({ open, onOpenChange, ownerId, onSubmit }: AddLineDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedLotId, setSelectedLotId] = useState('');
  const [qty, setQty] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [allLots, setAllLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(false);

  // Lotes filtrados por el producto seleccionado
  const lotsForProduct = allLots.filter((l) => l.productId === selectedProductId);

  useEffect(() => {
    if (!open) return;
    setSelectedProductId('');
    setSelectedLotId('');
    setQty('');
    setValidationError(null);
    setLoading(true);
    Promise.all([queryLineProducts(ownerId), queryLineLots(ownerId)])
      .then(([p, l]) => { setProducts(p); setAllLots(l); })
      .finally(() => setLoading(false));
  }, [open, ownerId]);

  // Limpiar lote al cambiar producto
  useEffect(() => {
    setSelectedLotId('');
  }, [selectedProductId]);

  function handleSubmit() {
    setValidationError(null);
    const parsed = containerLineSchema.safeParse({
      productId: selectedProductId,
      lotId: selectedLotId || undefined,
      qtyTotal: Number(qty),
    });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    onSubmit(parsed.data);
    onOpenChange(false);
  }

  const isReady = !!selectedProductId && Number(qty) >= 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Agregar Línea
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Agrega un producto al contenedor. Cada producto puede aparecer solo una vez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {loading ? (
            <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando productos y lotes...
            </div>
          ) : (
            <>
              {/* Producto */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Producto
                </Label>
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                  disabled={products.length === 0}
                >
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue
                      placeholder={
                        products.length === 0 ? 'Sin productos disponibles' : 'Selecciona un producto'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.productId} value={p.productId} className="text-base py-3">
                        <span className="font-semibold">{p.name}</span>
                        <span className="ml-2 text-muted-foreground text-sm font-mono">{p.sellerSku}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lote — opcional, solo lotes del producto seleccionado */}
              {selectedProductId && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Lote <span className="font-normal normal-case tracking-normal">(opcional)</span>
                  </Label>
                  <Select
                    value={selectedLotId || '__none__'}
                    onValueChange={(v) => setSelectedLotId(v === '__none__' ? '' : v)}
                    disabled={lotsForProduct.length === 0}
                  >
                    <SelectTrigger className="h-14 text-base">
                      <SelectValue placeholder="Sin lote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="text-base py-3 text-muted-foreground">
                        Sin lote
                      </SelectItem>
                      {lotsForProduct.map((l) => (
                        <SelectItem key={l.lotId} value={l.lotId} className="text-base py-3">
                          <span className="font-mono font-bold">{l.batchCode ?? l.lotId.slice(0, 8).toUpperCase()}</span>
                          {l.expiresAt && (
                            <span className="ml-2 text-muted-foreground text-sm">
                              Vence: {l.expiresAt}
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {lotsForProduct.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No hay lotes registrados para este producto.
                    </p>
                  )}
                </div>
              )}

              {/* Cantidad */}
              {selectedProductId && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Cantidad
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => { setQty(e.target.value); setValidationError(null); }}
                    placeholder="Ej: 100"
                    className="h-14 text-base"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {validationError && (
          <p className="text-sm text-destructive font-medium">{validationError}</p>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 px-6 text-base"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isReady || loading}
            className="h-12 px-8 text-base font-bold uppercase tracking-wider"
          >
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
