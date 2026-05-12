import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { History } from 'lucide-react';
import type { InventoryEvent, EventType, ProductListItem, Lot, Location } from '@/src/types/inventory';

const EVENT_LABELS: Record<EventType, string> = {
  RECEIVED:           'Recepción',
  PUTAWAY:            'Ubicación',
  MOVE:               'Movimiento',
  REBOX:              'Rebox',
  ADJUST:             'Ajuste',
  CLOSED_CONTAINER:   'Cierre',
  QUARANTINE:         'Cuarentena',
  RELEASE_QUARANTINE: 'Liberación',
};

const EVENT_COLORS: Record<EventType, string> = {
  RECEIVED:           'bg-cyan-100 text-cyan-800 border-cyan-200',
  PUTAWAY:            'bg-indigo-100 text-indigo-800 border-indigo-200',
  MOVE:               'bg-orange-100 text-orange-800 border-orange-200',
  REBOX:              'bg-yellow-100 text-yellow-800 border-yellow-200',
  ADJUST:             'bg-purple-100 text-purple-800 border-purple-200',
  CLOSED_CONTAINER:   'bg-slate-100 text-slate-700 border-slate-200',
  QUARANTINE:         'bg-red-100 text-red-800 border-red-200',
  RELEASE_QUARANTINE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

function Null() {
  return <span className="text-muted-foreground text-sm italic">—</span>;
}

interface InventoryEventsTableProps {
  events: InventoryEvent[];
  products: ProductListItem[];
  lots: Lot[];
  locations: Location[];
}

export function InventoryEventsTable({ events, products, lots, locations }: InventoryEventsTableProps) {
  const productMap  = new Map(products.map((p) => [p.productId, p.name]));
  const lotMap      = new Map(lots.map((l) => [l.lotId, l.batchCode]));
  const locationMap = new Map(locations.map((l) => [l.locationId, l.code]));

  const columns: Column<InventoryEvent>[] = [
    {
      key: 'createdAt',
      header: 'Fecha',
      cell: (e) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {e.createdAt
            ? new Date(e.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
            : <Null />}
        </span>
      ),
    },
    {
      key: 'eventType',
      header: 'Tipo',
      cell: (e) =>
        e.eventType ? (
          <Badge
            variant="outline"
            className={`text-xs font-bold uppercase tracking-wider ${EVENT_COLORS[e.eventType] ?? ''}`}
          >
            {EVENT_LABELS[e.eventType] ?? e.eventType}
          </Badge>
        ) : <Null />,
    },
    {
      key: 'productId',
      header: 'Producto',
      cell: (e) =>
        e.productId
          ? <span className="text-sm">{productMap.get(e.productId) ?? e.productId.slice(0, 8).toUpperCase()}</span>
          : <Null />,
    },
    {
      key: 'lotId',
      header: 'Lote',
      cell: (e) =>
        e.lotId
          ? <span className="font-mono text-sm">{lotMap.get(e.lotId) ?? e.lotId.slice(0, 8).toUpperCase()}</span>
          : <Null />,
    },
    {
      key: 'fromLocationId',
      header: 'Desde',
      cell: (e) =>
        e.fromLocationId
          ? <span className="font-mono font-bold text-sm tracking-wider">{locationMap.get(e.fromLocationId) ?? e.fromLocationId.slice(0, 8).toUpperCase()}</span>
          : <Null />,
    },
    {
      key: 'toLocationId',
      header: 'Hacia',
      cell: (e) =>
        e.toLocationId
          ? <span className="font-mono font-bold text-sm tracking-wider">{locationMap.get(e.toLocationId) ?? e.toLocationId.slice(0, 8).toUpperCase()}</span>
          : <Null />,
    },
    {
      key: 'quantity',
      header: 'Cant.',
      cell: (e) => (
        <span className="font-bold tabular-nums">
          {e.quantity != null ? e.quantity.toLocaleString('es-CO') : <Null />}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Motivo',
      cell: (e) => e.reason ? <span className="text-sm">{e.reason}</span> : <Null />,
    },
    {
      key: 'actorId',
      header: 'Actor',
      cell: (e) =>
        e.actorId
          ? <span className="font-mono text-sm text-muted-foreground">{e.actorId.slice(0, 8).toUpperCase()}</span>
          : <Null />,
    },
  ];

  if (events.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Sin eventos"
        description="No hay movimientos registrados para este contenedor."
      />
    );
  }

  return (
    <DataTable
      data={events}
      columns={columns}
      keyExtractor={(e) => e.eventId}
    />
  );
}
