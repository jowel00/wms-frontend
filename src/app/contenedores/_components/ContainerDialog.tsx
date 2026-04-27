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
import { queryAllContainersLocations } from '@/src/app/actions/containers';
import type { Owner, Warehouse, Location } from '@/src/types/inventory';
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
  owners: Owner[];
  warehouses: Warehouse[];
  defaultOwnerId?: string;
  defaultWarehouseId?: string;
  onSubmit: (data: ContainerFormValues) => void;
}

export function ContainerDialog({
  open,
  onOpenChange,
  owners,
  warehouses,
  defaultOwnerId,
  defaultWarehouseId,
  onSubmit,
}: ContainerDialogProps) {
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedAisleId, setSelectedAisleId] = useState('');
  const [selectedRackId, setSelectedRackId] = useState('');
  const [selectedBinId, setSelectedBinId] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Derivados en cliente — sin API calls adicionales
  const pasillos = allLocations.filter((l) => l.parentLocationId === null);
  const racks = selectedAisleId
    ? allLocations.filter((l) => l.parentLocationId === selectedAisleId)
    : [];
  const bins = selectedRackId
    ? allLocations.filter((l) => l.parentLocationId === selectedRackId)
    : [];

  // Resetear estado al abrir/cerrar el dialog
  useEffect(() => {
    if (!open) return;
    setSelectedOwnerId(defaultOwnerId ?? '');
    setSelectedWarehouseId(defaultWarehouseId ?? '');
    setSelectedAisleId('');
    setSelectedRackId('');
    setSelectedBinId('');
    setSelectedType('');
    setAllLocations([]);
  }, [open, defaultOwnerId, defaultWarehouseId]);

  // Una sola carga cuando se elige bodega — trae todo el árbol de una vez
  useEffect(() => {
    if (!open || !selectedWarehouseId) {
      setAllLocations([]);
      setSelectedAisleId('');
      setSelectedRackId('');
      setSelectedBinId('');
      return;
    }
    setSelectedAisleId('');
    setSelectedRackId('');
    setSelectedBinId('');
    setLoadingLocations(true);
    queryAllContainersLocations(selectedWarehouseId)
      .then(setAllLocations)
      .finally(() => setLoadingLocations(false));
  }, [selectedWarehouseId, open]);

  function handleAisleChange(id: string) {
    setSelectedAisleId(id);
    setSelectedRackId('');
    setSelectedBinId('');
  }

  function handleRackChange(id: string) {
    setSelectedRackId(id);
    setSelectedBinId('');
  }

  const filteredWarehouses = selectedOwnerId
    ? warehouses.filter((w) => w.ownerId === selectedOwnerId)
    : [];

  const selectedAisle = pasillos.find((p) => p.locationId === selectedAisleId);
  const selectedRack = racks.find((r) => r.locationId === selectedRackId);

  const isReady =
    !!selectedOwnerId &&
    !!selectedWarehouseId &&
    !!selectedAisleId &&
    !!selectedRackId &&
    !!selectedBinId &&
    !!selectedType;

  function handleSubmit() {
    if (!isReady) return;
    onSubmit({
      ownerId: selectedOwnerId,
      warehouseId: selectedWarehouseId,
      locationId: selectedBinId,
      type: selectedType,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Nuevo Contenedor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Selecciona el bin exacto donde irá el contenedor. El bin se activará automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Owner */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Owner
            </Label>
            <Select
              value={selectedOwnerId}
              onValueChange={(v) => {
                setSelectedOwnerId(v);
                setSelectedWarehouseId('');
              }}
            >
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Selecciona el owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((o) => (
                  <SelectItem key={o.ownerId} value={o.ownerId} className="text-base py-3">
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bodega */}
          {selectedOwnerId && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Bodega
              </Label>
              <Select
                value={selectedWarehouseId}
                onValueChange={setSelectedWarehouseId}
                disabled={filteredWarehouses.length === 0}
              >
                <SelectTrigger className="h-14 text-base">
                  <SelectValue
                    placeholder={
                      filteredWarehouses.length === 0
                        ? 'Sin bodegas para este owner'
                        : 'Selecciona una bodega'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredWarehouses.map((w) => (
                    <SelectItem key={w.warehouseId} value={w.warehouseId} className="text-base py-3">
                      <span className="font-semibold">{w.name}</span>
                      <span className="ml-2 text-muted-foreground text-sm">{w.city}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Árbol de ubicación — se muestra tras elegir bodega */}
          {selectedWarehouseId && (
            loadingLocations ? (
              <div className="h-14 flex items-center gap-2 px-3 text-muted-foreground text-sm border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando ubicaciones...
              </div>
            ) : (
              <>
                {/* Pasillo */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    1. Pasillo
                  </Label>
                  <Select
                    value={selectedAisleId}
                    onValueChange={handleAisleChange}
                    disabled={pasillos.length === 0}
                  >
                    <SelectTrigger className="h-14 text-base">
                      <SelectValue
                        placeholder={
                          pasillos.length === 0
                            ? 'Sin pasillos en esta bodega'
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
                </div>

                {/* Rack */}
                {selectedAisleId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      2. Rack — {selectedAisle?.code}
                    </Label>
                    <Select
                      value={selectedRackId}
                      onValueChange={handleRackChange}
                      disabled={racks.length === 0}
                    >
                      <SelectTrigger className="h-14 text-base">
                        <SelectValue
                          placeholder={
                            racks.length === 0
                              ? 'Sin racks en este pasillo'
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
                  </div>
                )}

                {/* Bin */}
                {selectedRackId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      3. Bin — {selectedRack?.code}
                    </Label>
                    <Select
                      value={selectedBinId}
                      onValueChange={setSelectedBinId}
                      disabled={bins.length === 0}
                    >
                      <SelectTrigger className="h-14 text-base">
                        <SelectValue
                          placeholder={
                            bins.length === 0
                              ? 'Sin bins en este rack'
                              : 'Selecciona un bin'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {bins.map((b) => (
                          <SelectItem key={b.locationId} value={b.locationId} className="text-base py-3">
                            <span className="font-mono font-bold">{b.code}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )
          )}

          {/* Tipo de contenedor */}
          {selectedBinId && (
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                4. Tipo de contenedor
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
            Crear Contenedor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
