interface SuccessResult {
  type: 'success';
  count: number;
  message: string;
}

interface ErrorResult {
  type: 'error';
  payload: unknown;
}

type UploadResultProps = SuccessResult | ErrorResult;

export function UploadResult(props: UploadResultProps) {
  if (props.type === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-6 bg-green-100 border-4 border-green-600 rounded-lg p-8 text-center"
      >
        <p className="text-6xl font-black text-green-700 leading-none mb-3" aria-hidden="true">
          ✓
        </p>
        <p className="text-3xl font-black text-green-800 uppercase tracking-wide">
          ¡Carga Exitosa!
        </p>
        <p className="text-xl font-bold text-green-700 mt-2">
          {props.count} {props.count === 1 ? 'producto procesado' : 'productos procesados'}
        </p>
        {props.message && (
          <p className="text-sm text-green-600 mt-2">{props.message}</p>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="mt-6 bg-red-50 border-4 border-red-500 rounded-lg p-6"
    >
      <p className="text-xl font-black text-red-700 mb-2 uppercase">Error en el Archivo</p>
      <p className="text-sm text-gray-600 mb-3">
        El servidor rechazó el archivo. Corrige los siguientes errores en tu CSV y vuelve a
        intentarlo:
      </p>
      <pre className="bg-red-100 border border-red-300 rounded p-4 text-xs text-red-900 overflow-auto max-h-64 whitespace-pre-wrap break-words">
        {JSON.stringify(props.payload, null, 2)}
      </pre>
    </div>
  );
}
