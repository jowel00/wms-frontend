'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { ContainerFormValues } from '@/src/lib/validations/containers';

const CONTAINER_TYPES = ['BOX', 'TOTE', 'PALLET'] as const;

const TYPE_LABELS: Record<string, string> = {
  BOX: 'Caja',
  TOTE: 'Tote',
  PALLET: 'Pallet',
};

interface ContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContainerFormValues) => void;
  lockedOwnerId: string;
  lockedOwnerName?: string;
  lockedWarehouseId: string;
  lockedWarehouseName?: string;
  lockedAisleCode?: string;
  lockedRackCode?: string;
  lockedBinId: string;
  lockedBinCode?: string;
}

export function ContainerDialog({
  open,
  onOpenChange,
  onSubmit,
  lockedOwnerId,
  lockedOwnerName,
  lockedWarehouseId,
  lockedWarehouseName,
  lockedAisleCode,
  lockedRackCode,
  lockedBinId,
  lockedBinCode,
}: ContainerDialogProps) {
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (!open) return;
    setSelectedType('');
  }, [open]);

  function handleSubmit() {
    if (!selectedType) return;
    onSubmit({
      ownerId: lockedOwnerId,
      warehouseId: lockedWarehouseId,
      locationId: lockedBinId,
      type: selectedType,
    });
    onOpenChange(false);
  }

  const path = [lockedAisleCode, lockedRackCode, lockedBinCode].filter(Boolean).join(' › ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Nuevo Contenedor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {path
              ? `Crearás un contenedor en ${path}. Elige el tipo y confirma.`
              : 'Elige el tipo de contenedor y confirma.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 overflow-y-auto flex-1 min-h-0">
          {/* Owner */}
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

          {/* Bodega */}
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

          {/* Pasillo */}
          {lockedAisleCode && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Pasillo
              </Label>
              <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
                <span className="font-mono font-bold text-base">{lockedAisleCode}</span>
                <Badge variant="secondary" className="ml-auto text-xs font-normal">
                  contexto actual
                </Badge>
              </div>
            </div>
          )}

          {/* Rack */}
          {lockedRackCode && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Rack
              </Label>
              <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
                <span className="font-mono font-bold text-base">{lockedRackCode}</span>
                <Badge variant="secondary" className="ml-auto text-xs font-normal">
                  contexto actual
                </Badge>
              </div>
            </div>
          )}

          {/* Bin */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bin
            </Label>
            <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
              <span className="font-mono font-bold text-base">{lockedBinCode}</span>
              <Badge variant="secondary" className="ml-auto text-xs font-normal">
                contexto actual
              </Badge>
            </div>
          </div>

          {/* Tipo de contenedor — único campo editable */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Tipo de contenedor
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {CONTAINER_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="text-base py-3">
                    {TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
            disabled={!selectedType}
            className="h-12 px-8 text-base font-bold uppercase tracking-wider"
          >
            Crear Contenedor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
