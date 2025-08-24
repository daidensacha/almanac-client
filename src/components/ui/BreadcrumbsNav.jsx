// src/components/ui/BreadcrumbsNav.jsx
import * as React from 'react';
import { Breadcrumbs, Link as MLink, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

/**
 * Dynamic breadcrumbs from current URL.
 *
 * Props:
 *  - root: { to: string, label: string }  // first crumb (e.g., Almanac)
 *  - labels: Record<string,string>         // segment -> label overrides (e.g., { categories: 'Categories' })
 *  - hideLastLink: boolean                 // last crumb as text (default true)
 *  - maxItems, itemsBeforeCollapse, itemsAfterCollapse: passed to MUI <Breadcrumbs>
 */
export default function BreadcrumbsNav({
  root = { to: '/almanac', label: 'Almanac' },
  labels = {},
  hideLastLink = true,
  maxItems = 4,
  itemsBeforeCollapse = 2,
  itemsAfterCollapse = 1,
  sx,
}) {
  const { pathname, state } = useLocation(); // state can hold names from navigate(..., { state })
  const parts = pathname.split('/').filter(Boolean); // ["category","edit","68a..."]

  // Helper: format one segment
  const pretty = (seg, idx) => {
    // If it's a Mongo-like id, shorten it
    if (/^[a-f\d]{24}$/i.test(seg)) {
      // try to read a human label from location.state if present
      const fromState =
        state?.name || state?.title || state?.common_name || state?.category || state?.event_name;
      return fromState ? String(fromState) : `#${seg.slice(0, 6)}`;
    }
    // map overrides first, else Title Case
    if (labels[seg]) return labels[seg];
    return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Build hrefs progressively
  const crumbs = [];
  let href = '';
  parts.forEach((seg, idx) => {
    href += `/${seg}`;
    crumbs.push({
      to: href,
      label: pretty(seg, idx),
    });
  });

  // Prepend the root crumb unless we’re *already* on it
  const showRoot = !parts.length || (root?.to && pathname !== root.to);
  const items = [...(showRoot && root ? [{ to: root.to, label: root.label }] : []), ...crumbs];

  return (
    <Breadcrumbs
      aria-label="breadcrumbs"
      maxItems={maxItems}
      itemsBeforeCollapse={itemsBeforeCollapse}
      itemsAfterCollapse={itemsAfterCollapse}
      sx={sx}
    >
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        if (isLast && hideLastLink) {
          return (
            <Typography key={c.to} color="text.primary">
              {c.label}
            </Typography>
          );
        }
        return (
          <MLink key={c.to} component={RouterLink} underline="hover" color="inherit" to={c.to}>
            {c.label}
          </MLink>
        );
      })}
    </Breadcrumbs>
  );
}
