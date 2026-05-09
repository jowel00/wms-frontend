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
import type { InventoryContainer, Location } from '@/src/types/inventory';
import type { MoveFormValues } from '@/src/lib/validations/containers';

interface MoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (containerId: string, data: MoveFormValues) => void;
  container: InventoryContainer | null;
  locations: Location[];
}

export function MoveDialog({
  open,
  onOpenChange,
  onSubmit,
  container,
  locations,
}: MoveDialogProps) {
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedLocationId('');
    setValidationError(null);
  }, [open]);

  // Construye etiquetas de path completo para cada BIN: PA-001 › RK-001 › BIN-001
  // Excluye el bin actual del contenedor
  const locationMap = new Map(locations.map((l) => [l.locationId, l]));
  const binOptions = locations
    .filter((l) => l.type === 'BIN' && l.active && l.locationId !== container?.locationId)
    .map((bin) => {
      const rack  = bin.parentLocationId ? locationMap.get(bin.parentLocationId) : undefined;
      const aisle = rack?.parentLocationId ? locationMap.get(rack.parentLocationId) : undefined;
      const path  = [aisle?.code, rack?.code, bin.code].filter(Boolean).join(' › ');
      return { locationId: bin.locationId, label: path || bin.code };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  // Etiqueta del bin actual
  const currentBinLabel = (() => {
    if (!container?.locationId) return null;
    const bin   = locationMap.get(container.locationId);
    const rack  = bin?.parentLocationId ? locationMap.get(bin.parentLocationId) : undefined;
    const aisle = rack?.parentLocationId ? locationMap.get(rack.parentLocationId) : undefined;
    return [aisle?.code, rack?.code, bin?.code].filter(Boolean).join(' › ') || container.locationId.slice(0, 8);
  })();

  function handleSubmit() {
    setValidationError(null);
    if (!selectedLocationId) {
      setValidationError('Selecciona una ubicación destino válida');
      return;
    }
    if (!container) return;
    onSubmit(container.containerId, { toLocationId: selectedLocationId });
    onOpenChange(false);
  }

  const shortId = container?.containerId.slice(0, 8).toUpperCase() ?? '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Mover Contenedor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Mueve el contenedor{' '}
            <span className="font-mono font-bold text-foreground">{shortId}</span>
            {currentBinLabel && (
              <>
                {' '}desde{' '}
                <span className="font-mono font-bold text-foreground">{currentBinLabel}</span>
              </>
            )}{' '}
            a un nuevo bin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bin de destino
            </Label>
            <Select
              value={selectedLocationId}
              onValueChange={setSelectedLocationId}
              disabled={binOptions.length === 0}
            >
              <SelectTrigger className="h-14 text-base">
                <SelectValue
                  placeholder={
                    binOptions.length === 0
                      ? 'Sin otros bins disponibles'
                      : 'Selecciona el bin destino'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {binOptions.map((b) => (
                  <SelectItem key={b.locationId} value={b.locationId} className="text-base py-3">
                    <span className="font-mono font-bold">{b.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            disabled={!selectedLocationId}
            className="h-12 px-8 text-base font-bold uppercase tracking-wider"
          >
            Confirmar Movimiento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
