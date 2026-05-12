'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { queryProductLots } from '@/src/app/actions/containers';
import type { Lot } from '@/src/types/inventory';

/** Fecha local del dispositivo en formato YYYY-MM-DD (no UTC). */
function localDateIso(d = new Date()): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Día siguiente a una fecha YYYY-MM-DD usando hora local. */
function nextDayIso(dateIso: string): string {
  const d = new Date(dateIso + 'T00:00:00'); // interpreta en hora local
  d.setDate(d.getDate() + 1);
  return localDateIso(d);
}

type LotMode = 'existing' | 'new';

export type LotPayload =
  | { lotId: string }
  | { batchCode: string; expiresAt: string; receivedAt: string };

interface LotSectionProps {
  ownerId: string;
  productId: string;
  /** null = sección incompleta o cargando; el padre debe deshabilitar el submit */
  onChange: (lot: LotPayload | null) => void;
}

export function LotSection({ ownerId, productId, onChange }: LotSectionProps) {
  const [lots, setLots]       = useState<Lot[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode]       = useState<LotMode>('new');

  const [selectedLotId, setSelectedLotId] = useState('');
  const [batchCode, setBatchCode]         = useState('');
  const [receivedAt, setReceivedAt]       = useState('');
  const [expiresAt, setExpiresAt]         = useState('');

  // Ref para evitar que onChange obsoleto dispare el effect de notificación
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const todayIso = localDateIso();
  const minExpiresAt = nextDayIso(receivedAt || todayIso);

  // Cuando cambia el producto: reset + fetch de lotes
  useEffect(() => {
    setLots([]);
    setMode('new');
    setSelectedLotId('');
    setBatchCode('');
    setReceivedAt('');
    setExpiresAt('');

    if (!productId) return;

    setLoading(true);
    queryProductLots(ownerId, productId)
      .then((found) => {
        setLots(found);
        setMode(found.length > 0 ? 'existing' : 'new');
      })
      .finally(() => setLoading(false));
  }, [ownerId, productId]);

  // Notifica al padre cada vez que el valor del lote cambia
  useEffect(() => {
    if (loading) { onChangeRef.current(null); return; }

    if (mode === 'existing') {
      onChangeRef.current(selectedLotId ? { lotId: selectedLotId } : null);
    } else {
      onChangeRef.current(
        batchCode && receivedAt && expiresAt
          ? { batchCode, expiresAt, receivedAt }
          : null
      );
    }
  }, [loading, mode, selectedLotId, batchCode, receivedAt, expiresAt]);

  function handleModeChange(next: LotMode) {
    setMode(next);
    if (next === 'existing') { setBatchCode(''); setReceivedAt(''); setExpiresAt(''); }
    else { setSelectedLotId(''); }
  }

  if (loading) {
    return (
      <div className="h-10 flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="size-4 animate-spin" />
        Buscando lotes del producto...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle modo — visible solo si existen lotes para el producto */}
      {lots.length > 0 && (
        <div className="flex rounded-md border overflow-hidden text-sm font-medium">
          <button
            type="button"
            onClick={() => handleModeChange('existing')}
            className={cn(
              'flex-1 py-2 transition-colors',
              mode === 'existing'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            Lote existente
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('new')}
            className={cn(
              'flex-1 py-2 transition-colors border-l',
              mode === 'new'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            Lote nuevo
          </button>
        </div>
      )}

      {/* Modo: lote existente */}
      {mode === 'existing' && (
        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Lote <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedLotId} onValueChange={setSelectedLotId}>
            <SelectTrigger className="h-14 text-base">
              <SelectValue placeholder="Selecciona un lote" />
            </SelectTrigger>
            <SelectContent>
              {lots.map((lot) => (
                <SelectItem key={lot.lotId} value={lot.lotId} className="text-base py-3">
                  <span className="font-semibold font-mono">
                    {lot.batchCode ?? lot.lotId.slice(0, 8)}
                  </span>
                  {lot.expiresAt && (
                    <span className="ml-2 text-muted-foreground text-sm">
                      Vence: {lot.expiresAt}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Modo: lote nuevo */}
      {mode === 'new' && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Lote (Batch Code) <span className="text-destructive">*</span>
            </Label>
            <Input
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              placeholder="Ej: LOTE-XYZ-456"
              className="h-14 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Fecha de Recibimiento <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              min={todayIso}
              value={receivedAt}
              onChange={(e) => {
                setReceivedAt(e.target.value);
                if (expiresAt && expiresAt <= e.target.value) setExpiresAt('');
              }}
              className="h-14 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Fecha de Vencimiento <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              min={minExpiresAt}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="h-14 text-base"
            />
          </div>
        </>
      )}
    </div>
  );
}
