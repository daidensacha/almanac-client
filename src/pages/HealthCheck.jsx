import * as React from 'react';
import HealthDashboard from '@/components/HealthDashboard';

const trimSlash = (s = '') => s.replace(/\/+$/, '');

export default function HealthCheck() {
  const base = trimSlash(import.meta.env.VITE_API || 'http://localhost:8000/api');

  // same endpoints you used last night
  const endpoints = {
    Auth: `${base}/auth/health`,
    User: `${base}/user/health`,
    Climate: `${base}/climate/health`,
  };

  const [status, setStatus] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastChecked, setLastChecked] = React.useState(Date.now());
  const refreshSeconds = 10;

  const pingOne = async (name, url) => {
    const t0 = performance.now();
    try {
      const res = await fetch(url, { method: 'GET', credentials: 'omit' });
      const json = await res.json().catch(() => ({}));
      const t1 = performance.now();
      return [
        name,
        { ok: res.ok && !!json?.ok, status: res.status, json, ms: Math.round(t1 - t0) },
      ];
    } catch {
      const t1 = performance.now();
      return [name, { ok: false, status: 0, json: {}, ms: Math.round(t1 - t0) }];
    }
  };

  const runCheck = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const pairs = await Promise.all(
        Object.entries(endpoints).map(([name, url]) => pingOne(name, url)),
      );
      setStatus(Object.fromEntries(pairs));
      setLastChecked(Date.now());
    } finally {
      setRefreshing(false);
    }
  }, [endpoints.Auth, endpoints.User, endpoints.Climate]);

  React.useEffect(() => {
    runCheck(); // initial
    const id = setInterval(runCheck, refreshSeconds * 1000);
    return () => clearInterval(id);
  }, [runCheck]);

  return (
    <HealthDashboard
      status={status}
      refreshing={refreshing}
      lastChecked={lastChecked}
      onRefresh={runCheck}
      refreshSeconds={refreshSeconds}
    />
  );
}
