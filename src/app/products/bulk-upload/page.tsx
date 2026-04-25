import type { Metadata } from 'next';
import { BulkUploadForm } from './BulkUploadForm';

export const metadata: Metadata = {
  title: 'Carga Masiva de Catálogo | WMS',
};

export default function BulkUploadPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">

      <header className="mb-6">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Catálogo de Productos
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Carga Masiva
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sube tu archivo CSV para registrar o actualizar productos en lote.
        </p>
      </header>

      <div className="bg-card border border-border rounded-lg p-6">
        <BulkUploadForm />
      </div>

      <footer className="mt-4 text-xs text-muted-foreground/60 text-center">
        Columnas esperadas:{' '}
        <code className="bg-muted text-muted-foreground px-1 py-0.5 rounded font-mono">
          sellerSku, name, barcodeUpcEan, hasExpiration
        </code>
      </footer>

    </div>
  );
}
