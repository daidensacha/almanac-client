// src/utils/calendar.js
import dayjs from '@/utils/dayjsConfig';

// Return 42 day cells (6 weeks * 7 days), Monday-start grid
export function getMonthGridDays(ref = dayjs()) {
  const monthStart = ref.startOf('month');
  // weekday(): 0 = Sunday, 1 = Monday ...
  const mondayIndex = (monthStart.weekday() + 6) % 7; // shift so Monday=0
  const gridStart = monthStart.subtract(mondayIndex, 'day');
  return Array.from({ length: 42 }, (_, i) => gridStart.add(i, 'day'));
}

export function ymd(d) {
  return dayjs(d).format('YYYY-MM-DD');
}
