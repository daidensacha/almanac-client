// src/utils/recurrence.js
import dayjs from '@/utils/dayjsConfig';

const unitMap = {
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year',
};

// helpers to emulate ≥ and ≤ with dayjs
const ge = (a, b, unit = 'millisecond') => a.isAfter(b, unit) || a.isSame(b, unit);
const le = (a, b, unit = 'millisecond') => a.isBefore(b, unit) || a.isSame(b, unit);

/**
 * Expand a single event into per-day occurrences for a given year.
 * Returns: Array<{ date: Dayjs, ev }>
 *
 * Supports:
 * - Single date (occurs_at only)
 * - Date range (occurs_at..occurs_to)
 * - Repeats with repeat_frequency + repeat_cycle in {Day, Week, Month}
 * - `repeat_yearly` → apply the same pattern every target year
 */
export function expandOccurrences(ev, { year = dayjs().year(), limit = 732 } = {}) {
  if (!ev?.occurs_at) return [];

  const hasEnd = !!ev.occurs_to;
  const freq = Number.isFinite(ev.repeat_frequency) ? Number(ev.repeat_frequency) : null;
  const cycle = (ev.repeat_cycle || '').toLowerCase(); // 'day' | 'week' | 'month' | 'year' | ''
  const yearly = !!ev.repeat_yearly;

  const origStart = dayjs(ev.occurs_at);
  const origEnd = hasEnd ? dayjs(ev.occurs_to) : origStart;

  const normalizeToYear = (d) => d.year(year);

  // Base window (for this calendar year if yearly; otherwise use original)
  let start = yearly ? normalizeToYear(origStart) : origStart;
  let end = yearly ? normalizeToYear(origEnd) : origEnd;

  // If not yearly, and the event window doesn't intersect the target year, skip
  if (!yearly) {
    const yStart = dayjs(`${year}-01-01`).startOf('day');
    const yEnd = dayjs(`${year}-12-31`).endOf('day');

    const overlaps =
      (ge(start, yStart, 'day') && le(start, yEnd, 'day')) ||
      (ge(end, yStart, 'day') && le(end, yEnd, 'day')) ||
      (start.isBefore(yStart, 'day') && end.isAfter(yEnd, 'day'));

    if (!overlaps) return [];

    // Clamp to the target year
    start = dayjs.max(start, yStart);
    end = dayjs.min(end, yEnd);
  }

  // No repetition specified → emit single or daily range
  if (!freq || !cycle) {
    if (!hasEnd) {
      return [{ date: start.startOf('day'), ev }];
    }
    const out = [];
    let d = start.startOf('day');
    const last = end.startOf('day');
    while (le(d, last, 'day') && out.length < limit) {
      out.push({ date: d, ev });
      d = d.add(1, 'day');
    }
    return out;
  }

  // Map unit
  const stepUnit =
    cycle === 'day' ? 'day' : cycle === 'week' ? 'week' : cycle === 'month' ? 'month' : null;

  if (!stepUnit) {
    // Unknown unit: treat like non-repeating
    return [{ date: start.startOf('day'), ev }];
  }

  // If no end date, emit the start once for this year
  if (!hasEnd) {
    return [{ date: start.startOf('day'), ev }];
  }

  // Repeating occurrences within [start, end]
  const out = [];
  let cursor = start.startOf('day');
  const last = end.startOf('day');

  while (le(cursor, last, 'day') && out.length < limit) {
    out.push({ date: cursor, ev });
    cursor = cursor.add(freq, stepUnit);
  }

  return out;
}

/**
 * Find the next upcoming occurrence from a reference date.
 * Checks the current year; if none found, checks the next year.
 */
export function nextOccurrence(ev, from = dayjs()) {
  const thisYear = expandOccurrences(ev, { year: from.year(), limit: 732 });
  const nextInThisYear =
    thisYear.find((o) => o.date.isSame(from, 'day') || o.date.isAfter(from)) || null;
  if (nextInThisYear) return nextInThisYear;

  const nextYear = expandOccurrences(ev, { year: from.add(1, 'year').year(), limit: 732 });
  return nextYear.length ? nextYear[0] : null;
}

/**
 * Days until a date (integer)
 */
export function daysUntil(date, from = dayjs()) {
  return dayjs(date).startOf('day').diff(from.startOf('day'), 'day');
}
