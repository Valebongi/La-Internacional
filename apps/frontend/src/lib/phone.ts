/**
 * Normaliza teléfonos argentinos a E.164 (+549...).
 *
 * Reglas (WhatsApp requiere el `9` post código de país para móviles AR):
 * - Strip todo lo no-dígito.
 * - Si empieza con 54 pero no tiene 9 después → insertamos 9.
 * - Si empieza con 549 → E.164 directo.
 * - Si no empieza con 54 → asumimos local AR y prefijamos +549.
 * - Si empieza con 15 y tiene 11 dígitos → asumimos +549 + local sin el 15.
 *
 * Devuelve null si no queda algo razonable.
 */
export function normalizePhoneAR(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (!digits || digits.length < 8) return null;

  let e164: string;

  if (digits.startsWith('549')) {
    e164 = '+' + digits;
  } else if (digits.startsWith('54')) {
    e164 = '+54' + '9' + digits.slice(2);
  } else if (digits.startsWith('15') && digits.length === 11) {
    e164 = '+549' + digits.slice(2);
  } else {
    e164 = '+549' + digits;
  }

  // Validación mínima: +549 + al menos 10 dígitos
  if (e164.length < 13) return null;
  return e164;
}

export function formatPhonePretty(e164: string): string {
  if (!e164.startsWith('+549') || e164.length < 13) return e164;
  const rest = e164.slice(4);
  if (rest.length !== 10) return e164;
  // +549 AAA BBB-CCCC (AAA area 3 digitos comun en interior)
  return `+54 9 ${rest.slice(0, 3)} ${rest.slice(3, 6)}-${rest.slice(6)}`;
}

export function parsePhoneList(text: string): string[] {
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
