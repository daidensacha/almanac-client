// src/utils/recurrenceGroup.js
import dayjs from '@/utils/dayjsConfig';
import { expandOccurrences } from '@/utils/recurrence';
import { ymd } from '@/utils/calendar';

/**
 * Build a Map<YYYY-MM-DD, Array<{ date: Dayjs, ev }>>
 * for all occurrences in a given year. Dates are normalized & time-sorted.
 */
export function occurrencesByDay(events = [], year = dayjs().year()) {
  const map = new Map();

  for (const ev of events) {
    const occs = expandOccurrences(ev, { year }) || [];
    for (const o of occs) {
      const d = dayjs(o.date); // normalize
      const key = ymd(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ date: d, ev: o.ev || ev });
    }
  }

  // sort each day’s occurrences chronologically
  for (const arr of map.values()) {
    arr.sort((a, b) => +a.date - +b.date); // Dayjs valueOf -> ms epoch
  }

  return map;
}
