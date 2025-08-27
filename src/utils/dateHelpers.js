// src/utils/dateHelpers.js (or inline)
import dayjs from 'dayjs';
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

// HEALTHCHECK HELPERS

export const fmt = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(); // full date+time
};

export const ago = (ts) => {
  if (!ts) return '—';
  const diff = Math.floor((Date.now() - ts) / 1000); // seconds
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

//
// day.js helpers
//

const asThisYear = (d, year = dayjs().year()) => (d ? dayjs(d).year(year) : null);

// Return the active window for the current year, handling wrap (e.g. Sep→Mar)
export function projectYearWindow(occurs_at, occurs_to, year = dayjs().year()) {
  const start = asThisYear(occurs_at, year);
  const end = asThisYear(occurs_to, year);
  if (!start || !end) return { start, end, wraps: false };

  // if end < start, it wraps into next year
  if (end.isBefore(start, 'day')) {
    return { start, end: end.add(1, 'year'), wraps: true };
  }
  return { start, end, wraps: false };
}

// Useful labels
export function formatRangeThisYear(occurs_at, occurs_to, year = dayjs().year()) {
  const { start, end } = projectYearWindow(occurs_at, occurs_to, year);
  const fmt = (d) => (d ? d.format('D MMM') : '—');
  return `${fmt(start)} to ${fmt(end)}`;
}

// Is "today" inside this year's window?
export function isInSeason(occurs_at, occurs_to, ref = dayjs()) {
  const { start, end } = projectYearWindow(occurs_at, occurs_to, ref.year());
  if (!start || !end) return false;
  return ref.isAfter(start.subtract(1, 'day')) && ref.isBefore(end.add(1, 'day'));
}

export function recurrenceText({ repeat_cycle, repeat_frequency }) {
  if (!repeat_cycle || !repeat_frequency) return 'Repeats yearly';
  const n = Number(repeat_frequency);
  const unit = repeat_cycle.toLowerCase();
  return n === 1 ? `Every ${unit}` : `Every ${n} ${unit}s`;
}
