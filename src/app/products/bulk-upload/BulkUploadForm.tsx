'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toast } from './_components/Toast';
import { DropZone } from './_components/DropZone';
import { UploadResult } from './_components/UploadResult';
import { bulkUpload, BulkUploadError } from '@/src/services/productService';
import type { BulkUploadResponse } from '@/src/types/inventory';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

type Status = 'idle' | 'uploading' | 'success' | 'error';

export function BulkUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [dropZoneKey, setDropZoneKey] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [successData, setSuccessData] = useState<BulkUploadResponse | null>(null);
  const [errorPayload, setErrorPayload] = useState<unknown>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleFileSelect(selected: File) {
    if (selected.size > MAX_FILE_BYTES) {
      setToast('El archivo supera el límite de 5 MB. Selecciona un archivo más pequeño.');
      return;
    }
    setFile(selected);
    setStatus('idle');
    setSuccessData(null);
    setErrorPayload(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || status === 'uploading') return;

    setStatus('uploading');
    setSuccessData(null);
    setErrorPayload(null);

    try {
      const data = await bulkUpload(file);
      setSuccessData(data);
      setStatus('success');
      setFile(null);
      setDropZoneKey((k) => k + 1); // reset DropZone display
    } catch (err) {
      if (err instanceof BulkUploadError) {
        setErrorPayload(err.payload);
      } else {
        setErrorPayload({ message: 'Error de red o del servidor. Intenta nuevamente.' });
      }
      setStatus('error');
    }
  }

  const isUploading = status === 'uploading';

  return (
    <>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      <form onSubmit={handleSubmit} noValidate>
        <DropZone key={dropZoneKey} onFileSelect={handleFileSelect} disabled={isUploading} />

        <Button
          type="submit"
          disabled={!file || isUploading}
          className="mt-4 w-full h-14 text-base font-black uppercase tracking-wider"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Subiendo archivo...
            </>
          ) : (
            'Cargar CSV'
          )}
        </Button>
      </form>

      {status === 'success' && successData && (
        <UploadResult type="success" count={successData.count} message={successData.message} />
      )}
      {status === 'error' && (
        <UploadResult type="error" payload={errorPayload} />
      )}
    </>
  );
}
