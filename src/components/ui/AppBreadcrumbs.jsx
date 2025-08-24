// src/components/ui/AppBreadcrumbs.jsx
import * as React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// helpers
const startCase = (s = '') => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const looksLikeId = (s = '') =>
  /^[a-f0-9]{24}$/i.test(s) || /^[0-9a-f-]{36}$/i.test(s) || /^\d+$/.test(s);

/**
 * AppBreadcrumbs
 *
 * Props:
 * - center: boolean
 * - maxItems: number
 * - includeHome: boolean
 * - homeLabel: string
 * - homeTo: string
 * - segmentsMap: Record<string, string | { label: string, to?: string }>
 * - idLabel: string (label to use for id-like segments, default "Details")
 * - hideIds: boolean (skip id-like segments entirely)
 * - paramResolver?: (seg, idx, segments) => string | null   // optional
 */
export default function AppBreadcrumbs({
  center = false,
  maxItems = 5,
  includeHome = true,
  homeLabel = 'Almanac',
  homeTo = '/almanac',
  segmentsMap = {},
  idLabel = 'Details',
  hideIds = false,
  paramResolver, // optional
}) {
  const { pathname } = useLocation();

  // /admin/almanac/edit/68ab... -> ["admin","almanac","edit","68ab..."]
  const rawSegments = React.useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  // Build cumulative hrefs
  const parts = React.useMemo(() => {
    const acc = [];
    rawSegments.forEach((seg, i) => {
      const to = '/' + rawSegments.slice(0, i + 1).join('/');
      acc.push({ seg, to, idx: i });
    });
    return acc;
  }, [rawSegments]);

  const toFor = (seg, defaultTo) => {
    const mapped = segmentsMap[seg];
    if (mapped && typeof mapped === 'object' && mapped.to) return mapped.to;
    return defaultTo;
  };

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
    if (looksLikeId(seg)) return idLabel;
    return startCase(seg);
  };

  const shouldRender = (seg) => !(hideIds && looksLikeId(seg));

  const visibleParts = parts.filter((p) => shouldRender(p.seg));

  return (
    <Box sx={{ mb: 2, textAlign: center ? 'center' : 'left' }}>
      <Breadcrumbs aria-label="breadcrumb" maxItems={maxItems}>
        {includeHome && (
          <Link component={RouterLink} underline="hover" color="inherit" to={homeTo}>
            {homeLabel}
          </Link>
        )}

        {visibleParts.map((p, i) => {
          const isLast = i === visibleParts.length - 1;
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
