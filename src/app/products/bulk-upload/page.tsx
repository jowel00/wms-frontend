import type { Metadata } from 'next';
import { BulkUploadForm } from './BulkUploadForm';

export const metadata: Metadata = {
  title: 'Carga Masiva de Catálogo | WMS',
};

export default function BulkUploadPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        <header className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            Catálogo de Productos
          </p>
          <h1 className="text-3xl font-black text-gray-900 uppercase leading-none">
            Carga Masiva
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sube tu archivo CSV para registrar o actualizar productos en lote.
          </p>
        </header>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <BulkUploadForm />
        </div>

        <footer className="mt-4 text-xs text-gray-400 text-center">
          Columnas esperadas:{' '}
          <code className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded">
            sellerSku, name, barcodeUpcEan, hasExpiration
          </code>
        </footer>

      </div>
    </main>
  );
}
