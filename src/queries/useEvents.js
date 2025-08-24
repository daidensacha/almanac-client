import { useMineList } from '@/hooks/useMineList';

export function useEvents(userId, extraParams = {}) {
  return useMineList('events', 'events', userId, extraParams);
}
