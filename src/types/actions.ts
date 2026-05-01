export type ActionResult<T = void> =
  | { error: string }
  | { success: true; data?: T };
