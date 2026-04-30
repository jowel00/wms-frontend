import type { Metadata } from 'next';
import { BulkUploadForm } from './BulkUploadForm';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = {
  title: 'Carga Masiva de Catálogo | WMS',
};

export default function BulkUploadPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">

      <PageHeader
        section="Catálogo de Productos"
        title="Carga Masiva"
        description="Sube tu archivo CSV para registrar o actualizar productos en lote."
        className="mb-6"
      />

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
