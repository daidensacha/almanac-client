// hooks/useHealth.js (or inside Dev.jsx)
import { useQuery } from '@tanstack/react-query';

async function fetchJson(url, withCreds = false) {
  const res = await fetch(url, withCreds ? { credentials: 'include' } : undefined);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

export function useHealth() {
  const base = import.meta.env.VITE_API; // e.g. http://localhost:8000/api

  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      // 1) Try /ping (public)
      try {
        const data = await fetchJson(`${base}/ping`);
        return normalize(data, 'ping');
      } catch (_) {
        // 2) Try /health without creds
        try {
          const data = await fetchJson(`${base}/health`);
          return normalize(data, 'health');
        } catch (_) {
          // 3) Try /health with creds (in case auth-protected)
          const data = await fetchJson(`${base}/health`, true);
          return normalize(data, 'health');
        }
      }
    },
    refetchInterval: 15000,
  });
}

function normalize(data, source) {
  // Map whatever your endpoint returns into a common shape
  // Support typical ping responses: { ok:true } or { message:'pong' }
  const ok = Boolean(data?.ok ?? data?.status === 'ok' ?? data?.message === 'pong');
  return {
    source,
    ok,
    db: data?.db ?? (ok ? 'ok' : 'unknown'),
    uptime: data?.uptime ?? data?.up ?? null,
    version: data?.version ?? null,
    counts: data?.counts ?? { users: 0, plants: 0, categories: 0, events: 0 },
    raw: data,
  };
}
