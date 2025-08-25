// src/utils/unsplash.js
import { useEffect, useMemo, useRef, useState } from 'react';
import api from './axiosClient'; // baseURL = VITE_API (e.g. http://localhost:8000/api)

/**
 * useUnsplashImage(query, options)
 * - Keeps your keyword-based random results (query = plant/category name).
 * - Sets {url, alt} like before.
 * - If the server includes `id` or `download_location`, it triggers
 *   /api/unsplash/download (non-blocking) to credit the photographer.
 *
 * options:
 *   - fallbackUrl?: string
 *   - enabled?: boolean (default true)
 *   - deps?: any[] (extra dependencies for the effect)
 */
export function useUnsplashImage(query, options) {
  const opts = Array.isArray(options) ? { deps: options } : options || {};
  const deps = Array.isArray(opts.deps) ? opts.deps : [];
  const fallbackUrl = 'fallbackUrl' in opts ? opts.fallbackUrl : null;
  const enabled = 'enabled' in opts ? !!opts.enabled : true;

  const [url, setUrl] = useState(fallbackUrl);
  const [alt, setAlt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent double-crediting in StrictMode re-renders
  const lastCreditedKeyRef = useRef(null);

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
        // server returns { url, alt, query } and may also include { id, download_location }
        const nextUrl = data.url ?? null;
        const nextAlt = data.alt ?? normalized;

        if (nextUrl) {
          setUrl(nextUrl);
          setAlt(nextAlt);

          // Credit the photo owner if server provided id or download_location
          const creditKey = data.id || data.download_location || nextUrl;
          if (creditKey && lastCreditedKeyRef.current !== creditKey) {
            lastCreditedKeyRef.current = creditKey;
            // Fire-and-forget; don't block UI
            const params = data.download_location
              ? { location: data.download_location }
              : data.id
              ? { id: data.id }
              : null;

            if (params) {
              api.get('/unsplash/download', { params }).catch(() => {
                /* swallow – crediting is best-effort */
              });
            }
          }
        } else {
          // soft-fail: use fallback or nothing
          setUrl(fallbackUrl ?? null);
          setAlt(nextAlt);
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
