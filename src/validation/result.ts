/**
 * Resultado de validação tipado e discriminado.
 *
 * Reaproveitado/alinhado com `packages/shared/src/validation/result.ts` do
 * projeto Veo. Mantido aqui sem dependência externa para o engine ser portável.
 *
 * Use `ok` como discriminante para o TypeScript estreitar o tipo automaticamente.
 */
export type ValidationResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string; readonly code: string | null };

export function valid<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

export function invalid<T>(error: string, code: string | null = null): ValidationResult<T> {
  return { ok: false, error, code };
}

/** Type guard utilitário para uso fora de `if (result.ok)`. */
export function isOk<T>(result: ValidationResult<T>): result is { ok: true; value: T } {
  return result.ok;
}
