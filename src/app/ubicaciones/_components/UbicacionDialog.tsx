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
import { queryLocations, queryLocationTypes } from '@/src/app/actions/locations';
import type { Location, LocationTypeItem } from '@/src/types/inventory';
import type { LocationFormValues } from '@/src/lib/validations/locations';

const TYPE_DESCRIPTIONS: Record<string, string> = {
  PASILLO: 'Vía de acceso principal dentro de la bodega. Agrupa los racks a lo largo de un corredor.',
  RACK: 'Estantería dentro de un pasillo. Contendrá los bins (posiciones individuales).',
  BIN: 'Posición individual de almacenamiento dentro de un rack. Aquí se ubica el inventario.',
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
  const [locationTypes, setLocationTypes] = useState<LocationTypeItem[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [selectedAisleId, setSelectedAisleId] = useState('');
  const [selectedRackId, setSelectedRackId] = useState('');

  const [pasillos, setPasillos] = useState<Location[]>([]);
  const [racks, setRacks] = useState<Location[]>([]);
  const [loadingPasillos, setLoadingPasillos] = useState(false);
  const [loadingRacks, setLoadingRacks] = useState(false);

  const selectedType = locationTypes.find((t) => t.typeId === selectedTypeId);
  const typeName = selectedType?.name ?? '';

  // Cargar tipos de ubicación y resetear estado al abrir
  useEffect(() => {
    if (!open) return;
    setSelectedTypeId('');
    setSelectedAisleId('');
    setSelectedRackId('');
    setPasillos([]);
    setRacks([]);
    setLoadingTypes(true);
    queryLocationTypes()
      .then(setLocationTypes)
      .finally(() => setLoadingTypes(false));
  }, [open]);

  // Cargar pasillos cuando el tipo requiere seleccionar uno
  useEffect(() => {
    if (!open || (typeName !== 'RACK' && typeName !== 'BIN')) return;
    setSelectedAisleId('');
    setSelectedRackId('');
    setRacks([]);
    setLoadingPasillos(true);
    queryLocations(warehouseId, undefined) // undefined = pasillos (top-level)
      .then(setPasillos)
      .finally(() => setLoadingPasillos(false));
  }, [typeName, open, warehouseId]);

  // Cargar racks cuando se selecciona un pasillo y el tipo es BIN
  useEffect(() => {
    if (!open || typeName !== 'BIN' || !selectedAisleId) return;
    setSelectedRackId('');
    setLoadingRacks(true);
    queryLocations(warehouseId, selectedAisleId)
      .then(setRacks)
      .finally(() => setLoadingRacks(false));
  }, [selectedAisleId, typeName, open, warehouseId]);

  const isReady =
    !!selectedTypeId && (
      typeName === 'PASILLO' ||
      (typeName === 'RACK' && !!selectedAisleId) ||
      (typeName === 'BIN' && !!selectedRackId) ||
      // Para tipos no contemplados en la jerarquía, solo se requiere el tipo
      (typeName !== 'PASILLO' && typeName !== 'RACK' && typeName !== 'BIN')
    );

  function handleSubmit() {
    if (!selectedTypeId || !isReady) return;

    const parentLocationId =
      typeName === 'PASILLO' ? null
      : typeName === 'RACK' ? selectedAisleId
      : typeName === 'BIN' ? selectedRackId
      : null;

    onSubmit({ warehouseId, typeId: selectedTypeId, typeName, parentLocationId });
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
            {loadingTypes ? (
              <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando tipos...
              </div>
            ) : (
              <Select value={selectedTypeId} onValueChange={setSelectedTypeId}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Selecciona el tipo de ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {locationTypes.map((t) => (
                    <SelectItem key={t.typeId} value={t.typeId} className="text-base py-3">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Descripción del tipo seleccionado */}
          {typeName && (
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 leading-relaxed">
              {TYPE_DESCRIPTIONS[typeName] ?? `Tipo de ubicación: ${typeName}`}
            </p>
          )}

          {/* Pasillo — requerido para RACK y BIN */}
          {(typeName === 'RACK' || typeName === 'BIN') && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {typeName === 'RACK' ? 'Pasillo donde irá el rack' : '1. Elige el pasillo'}
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
          {typeName === 'BIN' && selectedAisleId && (
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
            {typeName ? `Crear ${typeName.charAt(0) + typeName.slice(1).toLowerCase()}` : 'Crear ubicación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
