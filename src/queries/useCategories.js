// src/queries/useCategories.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';
import { normalizeCategory, serializeCategory } from '@/utils/normalizers';

// -------- Keys
export const keys = {
  all: ['categories'],
  list: (archived) => ['categories', 'list', archived],
  one: (id) => ['categories', 'one', id],
};

export function useCategories(archived = false, options = {}) {
  return useQuery({
    queryKey: keys.list(archived),
    queryFn: async () => {
      const { data } = await api.get('/categories', { params: { archived } });

      if (import.meta?.env?.MODE !== 'production') {
        // console.log('[useCategories] raw response:', data);
      }

      // backend returns { ok, categories } (legacy: allCategories)
      const raw = data?.categories ?? data?.allCategories ?? [];
      return raw.map(normalizeCategory);
    },
    ...options,
  });
}

// -------- Get one (if you need standalone fetch)
export function useCategory(id, options = {}) {
  return useQuery({
    queryKey: keys.one(id),
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get(`/category/${id}`);
      return normalizeCategory(data);
    },
    ...options,
  });
}

// -------- Create
export function useCreateCategory(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      const payload = serializeCategory(values);
      const { data } = await api.post('/category/create', payload);
      return normalizeCategory(data);
    },
    onSuccess: (_data, _vars) => {
      qc.invalidateQueries({ queryKey: keys.all, exact: false });
    },
    ...options,
  });
}

// -------- Update
export function useUpdateCategory(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const payload = serializeCategory(values);
      const { data } = await api.put(`/category/update/${id}`, payload);
      return normalizeCategory(data);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: keys.one(data._id) });
      qc.invalidateQueries({ queryKey: keys.all, exact: false });
    },
    ...options,
  });
}

// -------- Archive / Unarchive
export function useArchiveCategory(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archived = true }) => {
      const { data } = await api.patch(`/category/archive/${id}`, { archived });
      return normalizeCategory(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all, exact: false });
    },
    ...options,
  });
}

// -------- Delete
export function useDeleteCategory(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/category/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all, exact: false });
    },
    ...options,
  });
}
