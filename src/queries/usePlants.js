// src/queries/usePlants.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';
import { normalizePlant } from '@/utils/normalizers';

export const keys = {
  all: ['plants'],
  list: (archived) => ['plants', 'list', archived],
  one: (id) => ['plants', 'one', id],
};

export function usePlants(archived = false, options = {}) {
  return useQuery({
    queryKey: keys.list(archived),
    queryFn: async () => {
      const { data } = await api.get('/plants', { params: { archived } });
      const list = data?.plants ?? data?.allPlants ?? [];
      // if (import.meta.env.DEV) console.log('[usePlants] raw:', data);
      return list.map(normalizePlant);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function usePlant(id, options = {}) {
  return useQuery({
    queryKey: keys.one(id),
    enabled: !!id && (options.enabled ?? true),
    queryFn: async () => {
      const { data } = await api.get(`/plant/${id}`);
      return data?.plant ?? null;
    },
    ...options,
  });
}

export function useCreatePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/plant/create', payload);
      return data?.plant ?? data?.newPlant ?? null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'], exact: false });
    },
  });
}

export function useUpdatePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/plant/update/${id}`, payload);
      return data?.plant ?? data?.updatedPlant ?? null;
    },
    onSuccess: (doc) => {
      if (doc?._id) qc.invalidateQueries({ queryKey: ['plant', doc._id] });
      qc.invalidateQueries({ queryKey: ['plants'], exact: false });
    },
  });
}

export function useArchivePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archived = true }) => {
      const { data } = await api.patch(`/plant/archive/${id}`, { archived });
      return data?.plant ?? null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'], exact: false });
    },
  });
}

export function useDeletePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/plant/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'], exact: false });
    },
  });
}
