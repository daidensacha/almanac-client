// src/components/ui/AppBreadcrumbs.jsx
import * as React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// simple helpers
const startCase = (s = '') => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const looksLikeId = (s = '') =>
  /^[a-f0-9]{24}$/i.test(s) || /^[0-9a-f-]{36}$/i.test(s) || /^\d+$/.test(s);

/**
 * AppBreadcrumbs
 *
 * Props:
 * - center: boolean (center-align the whole trail)
 * - maxItems: number (MUI Breadcrumbs prop)
 * - includeHome: boolean (prepend Home/Almanac)
 * - homeLabel: string
 * - homeTo: string
 * - segmentsMap: Record<string, string | { label: string, to?: string }>
 *      Map path segment -> label (and optional custom link target).
 *      e.g. { admin: 'Admin', plants: 'Plants', 'category': { label: 'Categories', to: '/categories' } }
 * - paramResolver: (segment, index, segments) => string
 *      Custom label for dynamic segments (ids, slugs).
 */
export default function AppBreadcrumbs({
  center = false,
  maxItems = 5,
  includeHome = true,
  homeLabel = 'Almanac',
  homeTo = '/almanac',
  segmentsMap = {},
  paramResolver,
}) {
  const { pathname } = useLocation();

  // break /admin/almanac/edit/68ab... -> ["admin","almanac","edit","68ab..."]
  const rawSegments = React.useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  // Build cumulative hrefs for each breadcrumb
  const parts = React.useMemo(() => {
    const acc = [];
    rawSegments.forEach((seg, i) => {
      const to = '/' + rawSegments.slice(0, i + 1).join('/');
      acc.push({ seg, to, idx: i });
    });
    return acc;
  }, [rawSegments]);

  // Resolve display label for a segment
  const labelFor = (seg, idx) => {
    const mapped = segmentsMap[seg];
    if (mapped) {
      if (typeof mapped === 'string') return mapped;
      if (typeof mapped === 'object' && mapped.label) return mapped.label;
    }
    if (paramResolver) {
      const r = paramResolver(seg, idx, rawSegments);
      if (r) return r;
    }
    if (looksLikeId(seg)) return 'Details';
    return startCase(seg);
  };

  // Optional override for a link target from segmentsMap
  const toFor = (seg, defaultTo) => {
    const mapped = segmentsMap[seg];
    if (mapped && typeof mapped === 'object' && mapped.to) return mapped.to;
    return defaultTo;
  };

  return (
    <Box sx={{ mb: 2, textAlign: center ? 'center' : 'left' }}>
      <Breadcrumbs aria-label="breadcrumb" maxItems={maxItems}>
        {includeHome && (
          <Link component={RouterLink} underline="hover" color="inherit" to={homeTo}>
            {homeLabel}
          </Link>
        )}

        {parts.map((p, i) => {
          const isLast = i === parts.length - 1;
          const label = labelFor(p.seg, i);
          const to = toFor(p.seg, p.to);

          return isLast ? (
            <Typography key={p.to} color="text.primary">
              {label}
            </Typography>
          ) : (
            <Link key={p.to} component={RouterLink} underline="hover" color="inherit" to={to}>
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
