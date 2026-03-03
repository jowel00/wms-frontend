'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-4 rounded border-2 border-red-900 shadow-lg w-full max-w-lg"
    >
      <span className="text-xl font-black leading-none" aria-hidden="true">⚠</span>
      <p className="flex-1 font-bold text-sm leading-snug">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar alerta"
        className="font-black text-lg leading-none hover:text-red-200"
      >
        ✕
      </button>
    </div>
  );
}
