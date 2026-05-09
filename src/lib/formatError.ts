const UUID_RE = /\b([0-9a-f]{8})-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;

/**
 * Acorta UUIDs en mensajes de error del backend a sus primeros 8 chars uppercase.
 * Ej: "Container con ID [54621f95-dca8-42e2-...] no encontrado"
 *  →  "Container con ID [54621F95...] no encontrado"
 */
export function formatBackendError(message: string): string {
  return message.replace(UUID_RE, (_, first8) => `${first8.toUpperCase()}...`);
}
