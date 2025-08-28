// src/utils/recurrenceGroup.js
import dayjs from '@/utils/dayjsConfig';
import { expandOccurrences } from '@/utils/recurrence';
import { ymd } from '@/utils/calendar';

export function occurrencesByDay(events = [], year) {
  const map = new Map();
  for (const ev of events) {
    const occs = expandOccurrences(ev, { year });
    for (const o of occs) {
      const key = ymd(o.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ date: o.date, ev });
    }
  }
  // sort each day’s events by time/date
  for (const [k, arr] of map) arr.sort((a, b) => +a.date - +b.date);
  return map;
}
