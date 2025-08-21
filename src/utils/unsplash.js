import { useEffect, useMemo, useState } from 'react';
import api from './axiosClient'; // baseURL = VITE_API (e.g. http://localhost:8000/api)

export function useUnsplashImage(query, options) {
  const opts = Array.isArray(options) ? { deps: options } : options || {};
  const deps = Array.isArray(opts.deps) ? opts.deps : [];
  const fallbackUrl = 'fallbackUrl' in opts ? opts.fallbackUrl : null;
  const enabled = 'enabled' in opts ? !!opts.enabled : true;

  const [url, setUrl] = useState(fallbackUrl);
  const [alt, setAlt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // trim & normalize input like the server does
  const normalized = useMemo(() => (query || '').toString().trim(), [query]);

  useEffect(() => {
    if (!enabled || !normalized) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    api
      .get('/unsplash/photos', {
        params: { query: normalized },
        signal: controller.signal,
      })
      .then((res) => {
        const data = res?.data || {};
        // server returns { url, alt, query } or soft-fail { url: null, alt: 'fallback', ... }
        const nextUrl = data.url ?? null;

        if (nextUrl) {
          setUrl(nextUrl);
          setAlt(data.alt ?? normalized);
        } else {
          // soft-fail: use fallback or nothing
          setUrl(fallbackUrl ?? null);
          setAlt(normalized);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err);
        setUrl(fallbackUrl ?? null);
        setAlt(normalized);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [normalized, enabled, fallbackUrl, ...deps]);

  return { url, alt, loading, error };
}
