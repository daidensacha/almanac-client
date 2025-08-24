// src/hooks/useMineList.js
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

const unwrap = (data) =>
  Array.isArray(data)
    ? data
    : data?.allPlants ?? data?.allCategories ?? data?.allEvents ?? data?.items ?? data?.data ?? [];

export function useMineList(path, key, userId, extraParams = {}) {
  return useQuery({
    queryKey: [key, 'mine', userId, extraParams],
    enabled: !!userId, // don’t fire until we know the user id
    queryFn: async () => {
      const { data } = await api.get(`/${path}`, {
        params: { created_by: userId, archived: false, ...extraParams },
      });
      return unwrap(data);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
