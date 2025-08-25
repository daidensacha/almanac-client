// src/queries/useCategories.js
import { useMineList } from '@/hooks/useMineList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

export function useCategories(userId, extraParams = {}) {
  return useMineList('categories', 'categories', userId, extraParams);
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/category/create', payload);
      return data?.newCategory ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'], exact: false });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/category/update/${id}`, payload);
      return data?.updateCategory ?? data?.updatedCategory ?? data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['categories'], exact: false });
      if (data?._id) qc.invalidateQueries({ queryKey: ['category', data._id], exact: true });
    },
  });
}

export function useArchiveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archived = true }) => {
      const { data } = await api.patch(`/category/archive/${id}`, { archived });
      return data?.archivedCategory ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'], exact: false });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/category/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'], exact: false });
    },
  });
}
