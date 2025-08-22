// src/hooks/useClock.js
import { useEffect, useState } from 'react';

export function useClock({ interval = 60_000 } = {}) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}
