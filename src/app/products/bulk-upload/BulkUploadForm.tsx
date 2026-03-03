'use client';

import { useState } from 'react';
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

        <button
          type="submit"
          disabled={!file || isUploading}
          className="mt-4 w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black text-lg py-4 px-6 rounded-lg uppercase tracking-wider"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-3">
              <Spinner />
              Subiendo archivo...
            </span>
          ) : (
            'Cargar CSV'
          )}
        </button>
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

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
