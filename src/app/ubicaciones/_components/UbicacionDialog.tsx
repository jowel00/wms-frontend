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
import { Label } from '@/components/ui/label';
import { queryLocations } from '@/src/app/actions/locations';
import type { Location, LocationType } from '@/src/types/inventory';
import type { LocationFormValues } from '@/src/lib/validations/locations';

const TYPE_LABELS: Record<LocationType, string> = {
  PASILLO: 'Pasillo',
  RACK: 'Rack',
  BIN: 'Bin',
};

const TYPE_DESCRIPTIONS: Record<LocationType, string> = {
  PASILLO: 'Vía de acceso principal dentro de la bodega. Agrupa los racks a lo largo de un corredor.',
  RACK: 'Estantería dentro de un pasillo. Contendrá los bins (posiciones individuales).',
  BIN: 'Posición individual de almacenamiento dentro de un rack. Aquí se ubica el inventario.',
};

const SUBMIT_LABELS: Record<LocationType, string> = {
  PASILLO: 'Crear Pasillo',
  RACK: 'Crear Rack',
  BIN: 'Crear Bin',
};

interface UbicacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: string;
  onSubmit: (data: LocationFormValues) => void;
}

export function UbicacionDialog({
  open,
  onOpenChange,
  warehouseId,
  onSubmit,
}: UbicacionDialogProps) {
  const [type, setType] = useState<LocationType | ''>('');
  const [selectedAisleId, setSelectedAisleId] = useState('');
  const [selectedRackId, setSelectedRackId] = useState('');

  const [pasillos, setPasillos] = useState<Location[]>([]);
  const [racks, setRacks] = useState<Location[]>([]);
  const [loadingPasillos, setLoadingPasillos] = useState(false);
  const [loadingRacks, setLoadingRacks] = useState(false);

  // Resetear estado al abrir
  useEffect(() => {
    if (open) {
      setType('');
      setSelectedAisleId('');
      setSelectedRackId('');
      setPasillos([]);
      setRacks([]);
    }
  }, [open]);

  // Cargar pasillos cuando el tipo requiere seleccionar uno
  useEffect(() => {
    if (!open || (type !== 'RACK' && type !== 'BIN')) return;
    setSelectedAisleId('');
    setSelectedRackId('');
    setRacks([]);
    setLoadingPasillos(true);
    queryLocations(warehouseId, undefined) // undefined = pasillos (top-level)
      .then(setPasillos)
      .finally(() => setLoadingPasillos(false));
  }, [type, open, warehouseId]);

  // Cargar racks cuando se selecciona un pasillo y el tipo es BIN
  useEffect(() => {
    if (!open || type !== 'BIN' || !selectedAisleId) return;
    setSelectedRackId('');
    setLoadingRacks(true);
    queryLocations(warehouseId, selectedAisleId)
      .then(setRacks)
      .finally(() => setLoadingRacks(false));
  }, [selectedAisleId, type, open, warehouseId]);

  const isReady =
    type === 'PASILLO' ||
    (type === 'RACK' && !!selectedAisleId) ||
    (type === 'BIN' && !!selectedRackId);

  function handleSubmit() {
    if (!type || !isReady) return;

    const parentLocationId =
      type === 'PASILLO' ? null
      : type === 'RACK' ? selectedAisleId
      : selectedRackId; // BIN

    onSubmit({ warehouseId, type, parentLocationId });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Nueva Ubicación
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            El código se generará automáticamente. Elige el tipo y completa la jerarquía requerida.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Tipo — campo maestro */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Tipo
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as LocationType)}>
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Selecciona el tipo de ubicación" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABELS) as LocationType[]).map((t) => (
                  <SelectItem key={t} value={t} className="text-base py-3">
                    {TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descripción del tipo seleccionado */}
          {type !== '' && (
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 leading-relaxed">
              {TYPE_DESCRIPTIONS[type as LocationType]}
            </p>
          )}

          {/* Pasillo — requerido para RACK y BIN */}
          {(type === 'RACK' || type === 'BIN') && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {type === 'RACK' ? 'Pasillo donde irá el rack' : '1. Elige el pasillo'}
              </Label>
              {loadingPasillos ? (
                <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando pasillos...
                </div>
              ) : (
                <Select
                  value={selectedAisleId}
                  onValueChange={setSelectedAisleId}
                  disabled={pasillos.length === 0}
                >
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue
                      placeholder={
                        pasillos.length === 0
                          ? 'No hay pasillos disponibles'
                          : 'Selecciona un pasillo'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {pasillos.map((p) => (
                      <SelectItem key={p.locationId} value={p.locationId} className="text-base py-3">
                        <span className="font-mono font-bold">{p.code}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Rack — requerido solo para BIN (aparece tras elegir pasillo) */}
          {type === 'BIN' && selectedAisleId && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                2. Elige el rack
              </Label>
              {loadingRacks ? (
                <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando racks...
                </div>
              ) : (
                <Select
                  value={selectedRackId}
                  onValueChange={setSelectedRackId}
                  disabled={racks.length === 0}
                >
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue
                      placeholder={
                        racks.length === 0
                          ? 'No hay racks en este pasillo'
                          : 'Selecciona un rack'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {racks.map((r) => (
                      <SelectItem key={r.locationId} value={r.locationId} className="text-base py-3">
                        <span className="font-mono font-bold">{r.code}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
            disabled={!isReady}
            className="h-12 px-8 text-base font-bold uppercase tracking-wider"
          >
            {type ? SUBMIT_LABELS[type as LocationType] : 'Crear ubicación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
