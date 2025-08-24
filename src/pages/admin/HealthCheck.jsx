// pages/admin/HealthCheck.jsx
import { useEffect, useMemo, useState } from 'react';

function trimSlash(s) {
  return (s || '').replace(/\/+$/, '');
}

function normalize(data, source) {
  const ok = Boolean(data?.ok) || data?.status === 'ok' || data?.message === 'pong';

  return {
    source,
    ok,
    db: data?.db ?? (ok ? 'ok' : 'unknown'),
    uptime: data?.uptime ?? null,
    version: data?.version ?? null,
    counts: data?.counts ?? { users: 0, plants: 0, categories: 0, events: 0 },
    raw: data,
  };
}

export default function HealthCheck() {
  const base = useMemo(
    () => trimSlash(import.meta.env.VITE_API || 'http://localhost:8000/api'),
    [],
  );

  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // 1) Try /ping (public)
        const r1 = await fetch(`${base}/ping`);
        if (r1.ok) {
          const j1 = await r1.json();
          if (!cancelled) setState({ loading: false, data: normalize(j1, 'ping'), error: null });
          return;
        }
        // 2) Fallback /health (public)
        const r2 = await fetch(`${base}/health`);
        if (!r2.ok) throw new Error(`Health check failed (${r2.status})`);
        const j2 = await r2.json();
        if (!cancelled) setState({ loading: false, data: normalize(j2, 'health'), error: null });
      } catch (err) {
        if (!cancelled) setState({ loading: false, data: null, error: err.message || String(err) });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [base]);

  if (state.loading) return <div>Checking…</div>;
  if (state.error) return <div style={{ color: 'crimson' }}>Error: {state.error}</div>;

  const d = state.data;
  return (
    <div style={{ lineHeight: 1.6 }}>
      <h2>API Health</h2>
      <p>
        Source: <strong>{d.source}</strong>
        <br />
        DB: <strong>{d.db}</strong>
        <br />
        Uptime: <strong>{d.uptime ?? 'n/a'}</strong>
        <br />
        Version: <strong>{d.version ?? 'n/a'}</strong>
      </p>
      <h3>Counts</h3>
      <ul>
        <li>Users: {d.counts.users}</li>
        <li>Plants: {d.counts.plants}</li>
        <li>Categories: {d.counts.categories}</li>
        <li>Events: {d.counts.events}</li>
      </ul>
      <details>
        <summary>Raw</summary>
        <pre>{JSON.stringify(d.raw, null, 2)}</pre>
      </details>
    </div>
  );
}
