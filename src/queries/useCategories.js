// tiny wrapper so components can say "useCategories" and not care how it's fetched
import { useMineList } from '@/hooks/useMineList';

export function useCategories(userId, extraParams = {}) {
  // hits GET /categories (your backend already scopes by auth)
  return useMineList('categories', 'categories', userId, extraParams);
}
