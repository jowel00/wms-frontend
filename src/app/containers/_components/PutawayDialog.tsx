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
import type { PutawayFormValues } from '@/src/lib/validations/containers';

interface PutawayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (containerId: string, data: PutawayFormValues) => void;
  container: InventoryContainer | null;
  locations: Location[];
}

export function PutawayDialog({
  open,
  onOpenChange,
  onSubmit,
  container,
  locations,
}: PutawayDialogProps) {
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedLocationId('');
    setValidationError(null);
  }, [open]);

  // Construye etiquetas de path completo para cada BIN: PA-001 › RK-001 › BIN-001
  const locationMap = new Map(locations.map((l) => [l.locationId, l]));
  const binOptions = locations
    .filter((l) => l.type === 'BIN' && l.active)
    .map((bin) => {
      const rack  = bin.parentLocationId ? locationMap.get(bin.parentLocationId) : undefined;
      const aisle = rack?.parentLocationId ? locationMap.get(rack.parentLocationId) : undefined;
      const path  = [aisle?.code, rack?.code, bin.code].filter(Boolean).join(' › ');
      return { locationId: bin.locationId, label: path || bin.code };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  function handleSubmit() {
    setValidationError(null);
    if (!selectedLocationId) {
      setValidationError('Selecciona una ubicación (bin) válida');
      return;
    }
    if (!container) return;
    onSubmit(container.containerId, { locationId: selectedLocationId });
    onOpenChange(false);
  }

  const shortId = container?.containerId.slice(0, 8).toUpperCase() ?? '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Putaway — Ubicar Contenedor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Asigna un bin al contenedor{' '}
            <span className="font-mono font-bold text-foreground">{shortId}</span>.
            {' '}El contenedor pasará a estado{' '}
            <span className="font-semibold text-foreground">ACTIVE</span>.
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
                      ? 'Sin bins disponibles en esta bodega'
                      : 'Selecciona un bin'
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
            Confirmar Putaway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
