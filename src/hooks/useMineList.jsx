// src/hooks/useMineList.js
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

const unwrap = (data) =>
  Array.isArray(data)
    ? data
    : data?.allPlants ?? data?.allCategories ?? data?.allEvents ?? data?.items ?? data?.data ?? [];

export function useMineList(path, key, enabledOrUser, extraParams = {}) {
  // allow 3rd arg to be either a boolean "enabled" or a userId
  const enabled = typeof enabledOrUser === 'boolean' ? enabledOrUser : !!enabledOrUser;

  return useQuery({
    queryKey: [key, 'mine', extraParams],
    enabled,
    queryFn: async () => {
      const { data } = await api.get(`/${path}`, {
        params: { archived: false, ...extraParams },
      });
      return unwrap(data);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
