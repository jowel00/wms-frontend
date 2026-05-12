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
import { queryLotProducts } from '@/src/app/actions/lots';
import { lotSchema } from '@/src/lib/validations/lots';
import type { Owner, ProductListItem } from '@/src/types/inventory';
import type { LotFormValues } from '@/src/lib/validations/lots';

interface LotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owners: Owner[];
  defaultOwnerId?: string;
  onSubmit: (data: LotFormValues) => void;
}

export function LotDialog({
  open,
  onOpenChange,
  owners,
  defaultOwnerId,
  onSubmit,
}: LotDialogProps) {
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [receivedAt, setReceivedAt] = useState('');

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const todayIso = (() => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  })();
  const minExpiresAt = (() => {
    const base = receivedAt || todayIso;
    const d = new Date(base + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  })();

  useEffect(() => {
    if (!open) return;
    setSelectedOwnerId(defaultOwnerId ?? '');
    setSelectedProductId('');
    setBatchCode('');
    setExpiresAt('');
    setReceivedAt('');
    setProducts([]);
  }, [open, defaultOwnerId]);

  useEffect(() => {
    if (!open || !selectedOwnerId) {
      setProducts([]);
      setSelectedProductId('');
      return;
    }
    setSelectedProductId('');
    setLoadingProducts(true);
    queryLotProducts(selectedOwnerId)
      .then(setProducts)
      .finally(() => setLoadingProducts(false));
  }, [selectedOwnerId, open]);

  const isReady = !!selectedOwnerId && !!selectedProductId && batchCode.trim().length > 0;

  function handleSubmit() {
    if (!isReady) return;
    setValidationError(null);

    const parsed = lotSchema.safeParse({
      ownerId: selectedOwnerId,
      productId: selectedProductId,
      batchCode: batchCode.trim(),
      expiresAt: expiresAt || undefined,
      receivedAt: receivedAt || undefined,
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }

    onSubmit(parsed.data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Nuevo Lote
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Registra un lote de producto recibido. El código de lote debe ser único por producto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Owner — solo lectura, viene del filtro superior */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Owner
            </Label>
            <div className="h-14 flex items-center px-3 rounded-md border bg-muted/50 text-base font-semibold text-muted-foreground">
              {owners.find((o) => o.ownerId === selectedOwnerId)?.name ?? '—'}
            </div>
          </div>

          {/* Producto */}
          {selectedOwnerId && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Producto
              </Label>
              {loadingProducts ? (
                <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando productos...
                </div>
              ) : (
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                  disabled={products.length === 0}
                >
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue
                      placeholder={
                        products.length === 0
                          ? 'Sin productos para este owner'
                          : 'Selecciona un producto'
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
              )}
            </div>
          )}

          {/* Código de lote */}
          {selectedProductId && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Código de Lote
              </Label>
              <Input
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="Ej: LOT-2024-001"
                className="h-14 text-base font-mono"
              />
            </div>
          )}

          {/* Fechas */}
          {selectedProductId && (
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Recepción
                </Label>
                <Input
                  type="date"
                  min={todayIso}
                  value={receivedAt}
                  onChange={(e) => {
                    setReceivedAt(e.target.value);
                    if (expiresAt && expiresAt <= e.target.value) setExpiresAt('');
                    setValidationError(null);
                  }}
                  className="h-14 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Vencimiento
                </Label>
                <Input
                  type="date"
                  min={minExpiresAt}
                  value={expiresAt}
                  onChange={(e) => { setExpiresAt(e.target.value); setValidationError(null); }}
                  className="h-14 text-base"
                />
              </div>
            </div>
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
            disabled={!isReady}
            className="h-12 px-8 text-base font-bold uppercase tracking-wider"
          >
            Crear Lote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
