// src/utils/recurrence.js
import dayjs from '@/utils/dayjsConfig';

const unitMap = {
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year',
};

/**
 * Expand recurring event into concrete dates
 */
export function expandOccurrences(ev, { year = dayjs().year(), limit = 366 } = {}) {
  if (!ev.occurs_at || !ev.occurs_to) return [];

  // base start/end in this year
  let start = dayjs(ev.occurs_at).year(year).startOf('day');
  let end = dayjs(ev.occurs_to).year(year).endOf('day');

  // handle wrap-around (e.g. Dec -> Feb)
  if (end.isBefore(start, 'day')) {
    end = end.add(1, 'year');
  }

  const step = Math.max(1, Number(ev.repeat_frequency || 1));
  const unit = unitMap[ev.repeat_cycle] || 'week';

  const out = [];
  let cursor = start;

  while (cursor.isBefore(end.add(1, 'day')) && out.length < limit) {
    out.push({ date: cursor.toDate(), ev });
    cursor = cursor.add(step, unit);
  }

  return out;
}

/**
 * Find next upcoming occurrence
 */
export function nextOccurrence(ev, from = dayjs()) {
  const occs = expandOccurrences(ev, { year: from.year(), limit: 730 });
  return occs.find((o) => dayjs(o.date).isSame(from, 'day') || dayjs(o.date).isAfter(from)) || null;
}

/**
 * Days until a date (integer)
 */
export function daysUntil(date, from = dayjs()) {
  return dayjs(date).startOf('day').diff(from.startOf('day'), 'day');
}
