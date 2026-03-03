import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | WMS DeRocha',
};

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            Vision Boosters
          </p>
          <h1 className="text-4xl font-black text-gray-900 uppercase leading-none">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Panel principal de operaciones — DeRocha WMS
          </p>
        </header>

        <section aria-label="Indicadores clave" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <KpiCard label="Productos Totales" value="—" sub="Catálogo activo" />
          <KpiCard label="Bodegas Activas" value="—" sub="Ubicaciones en operación" />
          <KpiCard label="Recepciones Hoy" value="—" sub="Movimientos del día" />
        </section>

        <section aria-label="Acciones rápidas">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/products/bulk-upload"
              className="flex items-center gap-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg p-5 font-black uppercase tracking-wide transition-colors"
            >
              <span className="text-3xl" aria-hidden="true">📤</span>
              <div>
                <p className="text-lg leading-none">Carga Masiva</p>
                <p className="text-xs font-normal opacity-75 mt-1">Subir catálogo CSV</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
