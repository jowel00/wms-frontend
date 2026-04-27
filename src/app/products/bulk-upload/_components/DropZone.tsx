'use client';

import { useRef, useState } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [typeError, setTypeError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';
    if (!isCsv) {
      setTypeError(true);
      setSelectedFileName(null);
      return;
    }
    setTypeError(false);
    setSelectedFileName(file.name);
    onFileSelect(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected after an error
    e.target.value = '';
  }

  const borderClass = isDragging
    ? 'border-blue-500 bg-blue-50'
    : typeError
    ? 'border-red-500 bg-red-50'
    : selectedFileName
    ? 'border-green-500 bg-green-50'
    : 'border-gray-400 bg-white hover:border-gray-600';

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      aria-label="Zona de carga de archivo CSV"
      className={[
        'border-4 border-dashed rounded-lg p-10 text-center select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        borderClass,
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled}
        tabIndex={-1}
      />

      <div className="text-5xl mb-3" aria-hidden="true">
        {selectedFileName ? '✅' : typeError ? '❌' : '📂'}
      </div>

      {selectedFileName && (
        <p className="font-black text-green-800 text-lg truncate">{selectedFileName}</p>
      )}

      {typeError && (
        <p className="font-black text-red-700 text-base">Solo se aceptan archivos .csv</p>
      )}

      {!selectedFileName && !typeError && (
        <>
          <p className="font-bold text-gray-700 text-lg">Arrastra tu CSV aquí</p>
          <p className="text-gray-500 text-sm mt-1">o haz clic para seleccionar</p>
        </>
      )}

      <p className="text-xs text-gray-400 mt-4">Solo archivos .csv · Máx. 5 MB</p>
    </div>
  );
}
