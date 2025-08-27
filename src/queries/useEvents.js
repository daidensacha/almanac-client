// src/queries/useEvents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';
import { normalizeEvent } from '@/utils/normalizers';

export const keys = {
  all: ['events'],
  list: (archived = false) => ['events', 'list', { archived }],
  one: (id) => ['events', 'one', id],
};

// src/queries/useEvents.js
export function useEvents(archived = false, options = {}) {
  return useQuery({
    queryKey: keys.list(archived),
    queryFn: async () => {
      const { data } = await api.get('/events', { params: { archived } });
      // handle nested "data" wrapper
      const arr = Array.isArray(data?.events)
        ? data.events
        : Array.isArray(data?.data?.events) // <--- fix
        ? data.data.events
        : [];

      console.log('[useEvents] parsed events length:', arr.length);
      return arr.map(normalizeEvent);
    },
    staleTime: 30_000,
    ...options,
  });
}

// export function useEvents(archived = false, options = {}) {
//   return useQuery({
//     queryKey: keys.list(archived),
//     queryFn: async () => {
//       const { data } = await api.get('/events', { params: { archived } });
//       return data?.events ?? data?.allEvents ?? [];
//     },
//     ...options,
//   });
// }

// useEvent.js
// export function useEvent(id, options = {}) {
//   return useQuery({
//     queryKey: ['event', id],
//     enabled: !!id,
//     queryFn: async () => {
//       const { data } = await api.get(`/event/${id}`);
//       // Log the exact shape the hook sees:
//       console.log('[useEvent] AXIOS data:', data);
//       const raw = data?.data ?? data?.event ?? data;
//       console.log('[useEvent] RAW event:', raw);
//       console.log('[useEvent] RAW plant:', raw?.plant);
//       return raw;
//     },
//     // Temporarily disable select to compare raw vs normalized:
//     // select: (raw) => normalizeEvent(raw),
//     ...options,
//   });
// }
// useEvent.js
export function useEvent(id, options = {}) {
  return useQuery({
    queryKey: ['event', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get(`/event/${id}`);
      // Your envelope is { ok, data }
      const raw = data?.data ?? data?.event ?? data;
      return raw; // <-- return the raw event object
    },
    select: (raw) => normalizeEvent(raw), // normalize here
    ...options,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/event/create', payload);
      return data?.event || data?.newEvent;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all, exact: false });
    },
  });
}

export function useUpdateEvent(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.put(`/event/update/${id}`, payload);
      return data?.event || data?.updatedEvent;
    },
    onSuccess: (_data, _vars, ctx) => {
      qc.invalidateQueries({ queryKey: keys.all, exact: false });
    },
  });
}

// // src/queries/useEvents.js
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '@/utils/axiosClient';

// const keys = {
//   list: (archived = false) => ['events', { archived }],
//   one: (id) => ['event', id],
// };

// export function useEvents(archived = false, options = {}) {
//   return useQuery({
//     queryKey: keys.list(archived),
//     queryFn: async () => {
//       const { data } = await api.get('/events', { params: { archived } });
//       return data?.events ?? [];
//     },
//     ...options,
//   });
// }

// export function useEvent(id, options = {}) {
//   return useQuery({
//     queryKey: keys.one(id),
//     enabled: !!id && (options.enabled ?? true),
//     queryFn: async () => {
//       const { data } = await api.get(`/event/${id}`);
//       return data?.event ?? null;
//     },
//     ...options,
//   });
// }

// // (create/update/archive/delete similar to Plants if/when you need)
