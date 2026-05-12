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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { queryLocationTypes } from '@/src/app/actions/locations';
import type { LocationFormValues } from '@/src/lib/validations/locations';

const TYPE_DESCRIPTIONS: Record<string, string> = {
  PASILLO: 'Vía de acceso principal dentro de la bodega. Agrupa los racks a lo largo de un corredor.',
  RACK: 'Estantería dentro de un pasillo. Contendrá los bins (posiciones individuales).',
  BIN: 'Posición individual de almacenamiento dentro de un rack. Aquí se ubica el inventario.',
};

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: string;
  onSubmit: (data: LocationFormValues) => void;
  lockedTypeName: string;
  lockedAisleId?: string;
  lockedAisleCode?: string;
  lockedRackId?: string;
  lockedRackCode?: string;
}

export function LocationDialog({
  open,
  onOpenChange,
  warehouseId,
  onSubmit,
  lockedTypeName,
  lockedAisleId,
  lockedAisleCode,
  lockedRackId,
  lockedRackCode,
}: LocationDialogProps) {
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Fetch de tipos solo para obtener el typeId que requiere el backend
  useEffect(() => {
    if (!open) return;
    setSelectedTypeId('');
    setLoadingTypes(true);
    queryLocationTypes()
      .then((types) => {
        const match = types.find((t) => t.name === lockedTypeName);
        if (match) setSelectedTypeId(match.typeId);
      })
      .finally(() => setLoadingTypes(false));
  }, [open, lockedTypeName]);

  const parentLocationId =
    lockedTypeName === 'PASILLO' ? null
    : lockedTypeName === 'RACK' ? (lockedAisleId ?? null)
    : lockedTypeName === 'BIN' ? (lockedRackId ?? null)
    : null;

  function handleSubmit() {
    if (!selectedTypeId) return;
    onSubmit({ warehouseId, typeId: selectedTypeId, typeName: lockedTypeName, parentLocationId });
    onOpenChange(false);
  }

  const typeLabel = lockedTypeName.charAt(0) + lockedTypeName.slice(1).toLowerCase();

  const dialogDescription = (() => {
    if (lockedTypeName === 'PASILLO') return 'Crearás un pasillo en esta bodega. El código se generará automáticamente.';
    if (lockedTypeName === 'RACK' && lockedAisleCode) return `Crearás un rack en el pasillo ${lockedAisleCode}. El código se generará automáticamente.`;
    if (lockedTypeName === 'BIN' && lockedRackCode) return `Crearás un bin en el rack ${lockedRackCode}. El código se generará automáticamente.`;
    return 'El código se generará automáticamente.';
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Nuevo {typeLabel}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 overflow-y-auto flex-1 min-h-0">
          {/* Tipo — siempre bloqueado por contexto */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Tipo
            </Label>
            <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
              <span className="text-base font-bold">{typeLabel}</span>
              <Badge variant="secondary" className="ml-auto text-xs font-normal">
                contexto actual
              </Badge>
            </div>
          </div>

          {/* Descripción del tipo */}
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 leading-relaxed">
            {TYPE_DESCRIPTIONS[lockedTypeName] ?? `Tipo de ubicación: ${lockedTypeName}`}
          </p>

          {/* Pasillo — bloqueado para RACK y BIN */}
          {(lockedTypeName === 'RACK' || lockedTypeName === 'BIN') && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {lockedTypeName === 'RACK' ? 'Pasillo donde irá el rack' : 'Pasillo'}
              </Label>
              <div className="h-14 flex items-center gap-3 px-4 rounded-md border bg-muted/40">
                <span className="font-mono font-bold text-base">{lockedAisleCode}</span>
                <Badge variant="secondary" className="ml-auto text-xs font-normal">
                  contexto actual
                </Badge>
              </div>
            </div>
          )}

          {/* Rack — bloqueado solo para BIN */}
          {lockedTypeName === 'BIN' && (
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
            disabled={!selectedTypeId}
            className="h-12 px-8 text-base font-bold uppercase tracking-wider gap-2"
          >
            {loadingTypes ? (
              <><Loader2 className="size-4 animate-spin" />Preparando...</>
            ) : (
              `Crear ${typeLabel}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
