import { useMineList } from '@/hooks/useMineList';

export function usePlants(userId, extraParams = {}) {
  return useMineList('plants', 'plants', userId, extraParams);
}

// // src/queries/usePlants.js
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '@/utils/axiosClient';

// // Centralized keys so invalidation is consistent
// const keys = {
//   all: ['plants'],
//   mine: (userId, params) => ['plants:mine', userId ?? null, params ?? {}],
//   one: (id) => ['plant', id],
// };

// const unwrap = (data) =>
//   Array.isArray(data) ? data : data?.allPlants ?? data?.items ?? data?.data ?? [];

// /** List (current user’s plants). Backend accepts ?created_by & archived */
// export function usePlants(userId, extraParams = {}) {
//   return useQuery({
//     queryKey: keys.mine(userId, extraParams),
//     enabled: !!userId, // wait for auth
//     queryFn: async () => {
//       const { data } = await api.get('/plants', {
//         params: { created_by: userId, archived: false, ...extraParams },
//       });
//       return unwrap(data);
//     },
//     staleTime: 60_000,
//     refetchOnWindowFocus: false,
//   });
// }

// /** Get one plant */
// export function usePlant(id) {
//   return useQuery({
//     queryKey: keys.one(id),
//     enabled: !!id,
//     queryFn: async () => {
//       const { data } = await api.get(`/plant/${id}`);
//       return data?.plant ?? data;
//     },
//   });
// }

// /** Create */
// export function useCreatePlant() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload) => {
//       const { data } = await api.post('/plant/create', payload);
//       return data?.newPlant ?? data;
//     },
//     onSuccess: (_data, _vars, _ctx) => {
//       // refresh any plants lists you use
//       qc.invalidateQueries({ queryKey: keys.all, exact: false });
//       qc.invalidateQueries({ queryKey: ['plants:mine'], exact: false });
//     },
//   });
// }

// /** Update */
// export function useUpdatePlant() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ id, ...payload }) => {
//       const { data } = await api.put(`/plant/update/${id}`, payload);
//       return data?.updatedPlant ?? data;
//     },
//     onSuccess: (data) => {
//       qc.invalidateQueries({ queryKey: keys.one(data?._id), exact: true });
//       qc.invalidateQueries({ queryKey: ['plants:mine'], exact: false });
//     },
//   });
// }

// /** Archive / unarchive */
// export function useArchivePlant() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ id, archived = true }) => {
//       const { data } = await api.patch(`/plant/archive/${id}`, { archived });
//       return data?.archivedPlant ?? data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['plants:mine'], exact: false });
//     },
//   });
// }

// /** Delete */
// export function useDeletePlant() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (id) => {
//       const { data } = await api.delete(`/plant/delete/${id}`);
//       return data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['plants:mine'], exact: false });
//     },
//   });
// }
