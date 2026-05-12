'use client';

import { useEffect, useReducer } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { queryContainerTypes, queryLineProducts } from '@/src/app/actions/containers';
import { receiveSchema } from '@/src/lib/validations/containers';
import { LotSection } from './LotSection';
import type { LotPayload } from './LotSection';
import type { ContainerTypeItem, ProductListItem } from '@/src/types/inventory';
import type { ReceiveFormValues } from '@/src/lib/validations/containers';

interface ContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReceiveFormValues) => void;
  lockedOwnerId: string;
  lockedOwnerName?: string;
  lockedWarehouseId: string;
  lockedWarehouseName?: string;
}

type State = {
  containerTypes: ContainerTypeItem[];
  products: ProductListItem[];
  loading: boolean;
  selectedTypeId: string;
  selectedProductId: string;
  quantity: string;
  lot: LotPayload | null;
  validationError: string | null;
};

type Action =
  | { type: 'OPEN' }
  | { type: 'LOADED'; containerTypes: ContainerTypeItem[]; products: ProductListItem[] }
  | { type: 'SELECT_TYPE'; typeId: string }
  | { type: 'SELECT_PRODUCT'; productId: string }
  | { type: 'SET_QUANTITY'; quantity: string }
  | { type: 'SET_LOT'; lot: LotPayload | null }
  | { type: 'SET_VALIDATION_ERROR'; error: string };

const initialState: State = {
  containerTypes: [],
  products: [],
  loading: false,
  selectedTypeId: '',
  selectedProductId: '',
  quantity: '',
  lot: null,
  validationError: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN':
      return { ...initialState, loading: true };
    case 'LOADED':
      return { ...state, loading: false, containerTypes: action.containerTypes, products: action.products };
    case 'SELECT_TYPE':
      return { ...state, selectedTypeId: action.typeId };
    case 'SELECT_PRODUCT':
      return { ...state, selectedProductId: action.productId, lot: null, validationError: null };
    case 'SET_QUANTITY':
      return { ...state, quantity: action.quantity, validationError: null };
    case 'SET_LOT':
      return { ...state, lot: action.lot };
    case 'SET_VALIDATION_ERROR':
      return { ...state, validationError: action.error };
  }
}

export function ContainerDialog({
  open,
  onOpenChange,
  onSubmit,
  lockedOwnerId,
  lockedOwnerName,
  lockedWarehouseId,
  lockedWarehouseName,
}: ContainerDialogProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { containerTypes, products, loading, selectedTypeId, selectedProductId, quantity, lot, validationError } = state;

  const selectedProduct = products.find((p) => p.productId === selectedProductId);
  const hasExpiration   = selectedProduct?.hasExpiration ?? false;

  useEffect(() => {
    if (!open) return;
    dispatch({ type: 'OPEN' });
    Promise.all([queryContainerTypes(), queryLineProducts(lockedOwnerId)])
      .then(([types, prods]) => dispatch({ type: 'LOADED', containerTypes: types, products: prods }));
  }, [open, lockedOwnerId]);

  function handleSubmit() {
    const parsed = receiveSchema.safeParse({
      ownerId:     lockedOwnerId,
      warehouseId: lockedWarehouseId,
      typeId:      selectedTypeId,
      productId:   selectedProductId,
      quantity:    Number(quantity),
      lot:         hasExpiration ? (lot ?? undefined) : undefined,
    });
    if (!parsed.success) {
      dispatch({ type: 'SET_VALIDATION_ERROR', error: parsed.error.issues[0].message });
      return;
    }
    onSubmit(parsed.data);
    onOpenChange(false);
  }

  const isReady =
    !!selectedTypeId &&
    !!selectedProductId &&
    Number(quantity) >= 1 &&
    (!hasExpiration || lot !== null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Recibir Contenedor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Registra la recepción de un nuevo contenedor en{' '}
            <span className="font-semibold text-foreground">{lockedWarehouseName}</span>.
            El contenedor quedará en estado <span className="font-semibold text-foreground">CREATED</span> hasta
            que se ejecute el Putaway.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 overflow-y-auto flex-1 min-h-0">
          {/* Owner — locked */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Owner
            </Label>
            <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
              <span className="text-base font-semibold">{lockedOwnerName}</span>
              <Badge variant="secondary" className="ml-auto text-xs font-normal">
                contexto actual
              </Badge>
            </div>
          </div>

          {/* Bodega — locked */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bodega
            </Label>
            <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
              <span className="text-base font-semibold">{lockedWarehouseName}</span>
              <Badge variant="secondary" className="ml-auto text-xs font-normal">
                contexto actual
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando tipos y productos...
            </div>
          ) : (
            <>
              {/* Tipo de contenedor */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Tipo de contenedor
                </Label>
                <Select
                  value={selectedTypeId}
                  onValueChange={(typeId) => dispatch({ type: 'SELECT_TYPE', typeId })}
                  disabled={containerTypes.length === 0}
                >
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue
                      placeholder={
                        containerTypes.length === 0 ? 'Sin tipos disponibles' : 'Selecciona el tipo'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {containerTypes.map((t) => (
                      <SelectItem key={t.typeId} value={t.typeId} className="text-base py-3">
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Producto */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Producto
                </Label>
                <Select
                  value={selectedProductId}
                  onValueChange={(productId) => dispatch({ type: 'SELECT_PRODUCT', productId })}
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
                        <span className="ml-2 text-muted-foreground text-sm font-mono">
                          {p.sellerSku}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lote — solo si el producto requiere fecha de vencimiento */}
              {hasExpiration && (
                <div className="space-y-4 rounded-lg border border-dashed p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Información de Lote
                  </p>
                  <LotSection
                    ownerId={lockedOwnerId}
                    productId={selectedProductId}
                    onChange={(lot) => dispatch({ type: 'SET_LOT', lot })}
                  />
                </div>
              )}

              {/* Cantidad */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Cantidad
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => dispatch({ type: 'SET_QUANTITY', quantity: e.target.value })}
                  placeholder="Ej: 50"
                  className="h-14 text-base"
                />
              </div>
            </>
          )}
        </div>

        {validationError && (
          <p className="text-sm text-destructive font-medium px-1">{validationError}</p>
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
            Recibir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
