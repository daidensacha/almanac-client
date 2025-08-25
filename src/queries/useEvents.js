// src/queries/useEvents.js
import { useMineList } from '@/hooks/useMineList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

export function useEvents(userId, extraParams = {}) {
  return useMineList('events', 'events', userId, extraParams);
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/event/create', payload);
      return data?.newEvent ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'], exact: false });
    },
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/event/update/${id}`, payload);
      return data?.updatedEvent ?? data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['events'], exact: false });
      if (data?._id) qc.invalidateQueries({ queryKey: ['event', data._id], exact: true });
    },
  });
}

export function useArchiveEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archived = true }) => {
      const { data } = await api.patch(`/event/archive/${id}`, { archived });
      return data?.archivedEvent ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'], exact: false });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/event/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'], exact: false });
    },
  });
}
