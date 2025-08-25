// src/queries/usePlants.js
import { useMineList } from '@/hooks/useMineList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

export function usePlants(userId, extraParams = {}) {
  return useMineList('plants', 'plants', userId, extraParams);
}

export function useCreatePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/plant/create', payload);
      return data?.newPlant ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'], exact: false });
    },
  });
}

export function useUpdatePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/plant/update/${id}`, payload);
      return data?.updatedPlant ?? data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['plants'], exact: false });
      if (data?._id) qc.invalidateQueries({ queryKey: ['plant', data._id], exact: true });
    },
  });
}

export function useArchivePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archived = true }) => {
      const { data } = await api.patch(`/plant/archive/${id}`, { archived });
      return data?.archivedPlant ?? data;
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
