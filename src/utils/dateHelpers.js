// src/utils/dateHelpers.js (or inline)
import { parseISO, parse, isValid } from 'date-fns';

export function toDateOrNull(v) {
  if (!v) return null;
  if (v instanceof Date) return isValid(v) ? v : null;

  if (typeof v === 'string') {
    // Try ISO first: "2025-08-21" or "2025-08-21T12:34:56Z"
    try {
      const iso = parseISO(v);
      if (isValid(iso)) return iso;
    } catch {}
    // Try your displayed format (if you stored "dd/MM/yyyy" previously)
    const dmy = parse(v, 'dd/MM/yyyy', new Date());
    if (isValid(dmy)) return dmy;
  }
  return null;
}

export function toIsoDateStringOrNull(d) {
  if (!(d instanceof Date) || !isValid(d)) return null;
  // if your API expects date-only: YYYY-MM-DD
  return d.toISOString().slice(0, 10);
  // or return d.toISOString() if you want full timestamp
}
