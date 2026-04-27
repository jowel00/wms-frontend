import type { BulkUploadErrorPayload } from '@/src/services/productService';

const MAX_VISIBLE = 50;

interface SuccessResult {
  type: 'success';
  count: number;
  message: string;
}

interface ErrorResult {
  type: 'error';
  payload: BulkUploadErrorPayload | null;
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

  const { payload } = props;
  const mainMessage =
    payload?.message ?? payload?.error ?? 'El servidor rechazó el archivo.';
  const allErrors = payload?.errors ?? [];
  const visible = allErrors.slice(0, MAX_VISIBLE);
  const remaining = allErrors.length - visible.length;

  return (
    <div
      role="alert"
      className="mt-6 bg-red-50 border-4 border-red-500 rounded-lg p-6"
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xl font-black text-red-700 uppercase">Error en el Archivo</p>
          <p className="text-base font-semibold text-red-800 mt-1">{mainMessage}</p>
        </div>
        {allErrors.length > 0 && (
          <span className="shrink-0 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">
            {allErrors.length} error{allErrors.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Lista de errores de validación */}
      {visible.length > 0 ? (
        <>
          {/* Encabezado de columnas */}
          <div className="grid grid-cols-[5rem_8rem_1fr] gap-x-3 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500">
            <span>Fila</span>
            <span>Campo</span>
            <span>Detalle</span>
          </div>

          <ul className="space-y-1 max-h-72 overflow-auto mt-1">
            {visible.map((err, i) => (
              <li
                key={i}
                className="grid grid-cols-[5rem_8rem_1fr] gap-x-3 items-start bg-red-100 border border-red-300 rounded px-3 py-2 text-sm text-red-900"
              >
                <span className="font-mono font-bold">
                  {err.row != null ? `#${err.row}` : '—'}
                </span>
                <span className="font-medium truncate" title={err.field}>
                  {err.field}
                </span>
                <span>{err.message}</span>
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <p className="mt-2 text-xs text-red-500 text-right font-semibold">
              +{remaining} error{remaining !== 1 ? 'es' : ''} adicional{remaining !== 1 ? 'es' : ''} (solo se muestran los primeros {MAX_VISIBLE})
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-600">
          Corrige el archivo CSV y vuelve a intentarlo.
        </p>
      )}
    </div>
  );
}
