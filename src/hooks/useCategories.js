import { useQuery } from '@tanstack/react-query';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/api/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
    staleTime: 60000,
  });
}

export function usePlants() {
  return useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/api/plants`);
      if (!res.ok) throw new Error('Failed to fetch plants');
      return res.json();
    },
    staleTime: 60000,
  });
}
