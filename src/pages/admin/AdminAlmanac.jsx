// src/pages/admin/Almanac.jsx
import { useState, useMemo, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';

// --- helpers ---
const unwrap = (key, payload) => {
  if (Array.isArray(payload)) return payload;
  const map = {
    users: ['users', 'allUsers', 'items', 'data'],
    plants: ['allPlants', 'plants', 'items', 'data'],
    categories: ['allCategories', 'categories', 'items', 'data'],
    events: ['allEvents', 'events', 'items', 'data'],
  };
  for (const k of map[key] || []) {
    if (Array.isArray(payload?.[k])) return payload[k];
  }
  return [];
};

const isoGetter = (field) => (p) => p.row?.[field] ? new Date(p.row[field]).toLocaleString() : '';

const createdByCol = {
  field: 'created_by',
  headerName: 'Created By',
  width: 260,
  valueGetter: (p) => {
    const c = p.row?.created_by;
    if (!c) return '';
    if (typeof c === 'object') {
      const name = [c.firstname, c.lastname].filter(Boolean).join(' ').trim();
      const id = c._id || c.id || '';
      return name ? `${name} (${id})` : id;
    }
    return c; // raw ObjectId string
  },
};

// safely get created_by id and name from either a populated object or a string
function getCbId(cb) {
  return typeof cb === 'string' ? cb : cb?._id || '';
}
function getCbName(cb) {
  return typeof cb === 'object'
    ? [cb?.firstname, cb?.lastname].filter(Boolean).join(' ').trim()
    : '';
}

export function useAutoCols(rows) {
  const [createdByFilter, setCreatedByFilter] = useState(null);

  const cols = useMemo(() => {
    if (!rows?.length) return [];
    const keys = Object.keys(rows[0]).filter((k) => !['__v', 'password', 'token'].includes(k));
    const built = keys.map((k) => {
      if (k === 'created_by') {
        return {
          field: 'created_by',
          headerName: 'Created By',
          flex: 1,
          minWidth: 200,
          renderCell: (p) => {
            const id = getCbId(p.row.created_by);
            const name = getCbName(p.row.created_by);
            const label = name || id || '—';
            const selected = createdByFilter === id;
            return (
              <Chip
                size="small"
                label={label}
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatedByFilter((cur) => (cur === id ? null : id));
                }}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
              />
            );
          },
          valueGetter: (p) => {
            const id = getCbId(p.row.created_by);
            const name = getCbName(p.row.created_by);
            return name ? `${name} (${id})` : id || '';
          },
        };
      }
      if (k === '_id') {
        return {
          field: '_id',
          headerName: 'ID',
          flex: 1,
          minWidth: 240,
          renderCell: (p) => {
            const id = p.row?._id || '';
            const name = getCbName(p.row?.created_by);
            return name ? `(${name}) ${id}` : id;
          },
        };
      }
      return {
        field: k,
        headerName: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        flex: 1,
        minWidth: 140,
        valueGetter: (p) => {
          const v = p.row[k];
          if (v == null) return '';
          if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
            try {
              return new Date(v).toLocaleString();
            } catch {
              return v;
            }
          }
          return v;
        },
      };
    });

    // ensure _id first
    const idx = built.findIndex((c) => c.field === '_id');
    if (idx > 0) {
      const [idCol] = built.splice(idx, 1);
      built.unshift(idCol);
    }

    return built;
  }, [rows, createdByFilter]);

  const filteredRows = useMemo(() => {
    if (!createdByFilter) return rows || [];
    return (rows || []).filter((r) => getCbId(r.created_by) === createdByFilter);
  }, [rows, createdByFilter]);

  return { cols, filteredRows, createdByFilter, setCreatedByFilter };
}

// explicit columns we know about; we'll still fall back safely
const plantColsExplicit = [
  createdByCol,
  { field: 'common_name', headerName: 'Common Name', flex: 1, minWidth: 180 },
  { field: 'botanical_name', headerName: 'Botanical Name', flex: 1, minWidth: 200 },
  { field: 'sow_at', headerName: 'Sow At', width: 160, valueGetter: isoGetter('sow_at') },
  { field: 'plant_at', headerName: 'Plant At', width: 160, valueGetter: isoGetter('plant_at') },
  {
    field: 'harvest_at',
    headerName: 'Harvest From',
    width: 160,
    valueGetter: isoGetter('harvest_at'),
  },
  {
    field: 'harvest_to',
    headerName: 'Harvest To',
    width: 160,
    valueGetter: isoGetter('harvest_to'),
  },
  { field: 'archived', headerName: 'Archived', width: 120 },
];

const eventColsExplicit = [
  createdByCol,
  { field: 'event_name', headerName: 'Event', flex: 1, minWidth: 200 },
  { field: 'description', headerName: 'Description', flex: 1, minWidth: 220 },
  { field: 'occurs_at', headerName: 'Occurs At', width: 180, valueGetter: isoGetter('occurs_at') },
  { field: 'occurs_to', headerName: 'Occurs To', width: 180, valueGetter: isoGetter('occurs_to') },
  { field: 'repeat_frequency', headerName: 'Freq', width: 90 },
  { field: 'repeat_cycle', headerName: 'Cycle', width: 120 },
  { field: 'archived', headerName: 'Archived', width: 110 },
];

// categories sometimes didn’t have created_by first — we force it first here
const categoryColsExplicit = [
  createdByCol,
  // adapt to your shape (you showed fields `category`, `description`, `slug?`, etc.)
  { field: 'category', headerName: 'Category', flex: 1, minWidth: 180 },
  { field: 'description', headerName: 'Description', flex: 1, minWidth: 220 },
  { field: 'slug', headerName: 'Slug', width: 160 },
  { field: 'archived', headerName: 'Archived', width: 120 },
];

// users table (handy for selecting a filter)
const userCols = [
  { field: '_id', headerName: 'User ID', width: 260 },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 200,
    valueGetter: (p) => [p.row.firstname, p.row.lastname].filter(Boolean).join(' ').trim(),
  },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
  { field: 'role', headerName: 'Role', width: 120 },
  { field: 'created_at', headerName: 'Created', width: 180, valueGetter: isoGetter('created_at') },
];

// const userCols = [
//   {
//     field: '_id',
//     headerName: 'User ID',
//     width: 260,
//     renderCell: (p) => {
//       const id = p.row?._id || '';
//       const name = getCbName(p.row);
//       const label = name ? `${name} (${id})` : id;

//       // If you’re using the hook’s filter state:
//       const selected = createdByFilter === id;

//       return (
//         <Chip
//           size="small"
//           label={label}
//           onClick={(e) => {
//             e.stopPropagation(); // don’t trigger row click
//             setCreatedByFilter((cur) => (cur === id ? null : id));
//           }}
//           color={selected ? 'primary' : 'default'}
//           variant={selected ? 'filled' : 'outlined'}
//         />
//       );
//     },
//   },
//   {
//     field: 'name',
//     headerName: 'Name',
//     flex: 1,
//     minWidth: 200,
//     valueGetter: (p) => [p.row.firstname, p.row.lastname].filter(Boolean).join(' ').trim(),
//   },
//   { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
//   { field: 'role', headerName: 'Role', width: 120 },
//   { field: 'created_at', headerName: 'Created', width: 180, valueGetter: isoGetter('created_at') },
// ];

// --- data hooks (axios client already has baseURL + withCredentials) ---
const useList = (path, key, params) =>
  useQuery({
    queryKey: ['almanac', path, key, params ?? null],
    queryFn: async () => {
      const { data } = await api.get(`/${path}`, { params: params || {} });
      return unwrap(key, data);
    },
    staleTime: 60000,
  });

export default function AdminAlmanac() {
  const [tab, setTab] = useState(0);
  const [createdBy, setCreatedBy] = useState(null); // {_id, firstname, lastname}

  const [createdByFilter, setCreatedByFilter] = useState(null); // string | null

  const { user } = useAuthContext();
  const [mineOnly, setMineOnly] = useState(false);

  // data
  const usersQ = useList('admin/users', 'users');
  const plantsQ = useList(
    'admin/plants',
    'plants',
    createdBy ? { created_by: createdBy._id } : undefined,
  );
  const catsQ = useList(
    'admin/categories',
    'categories',
    createdBy ? { created_by: createdBy._id } : undefined,
  );
  const eventsQ = useList(
    'admin/events',
    'events',
    createdBy ? { created_by: createdBy._id } : undefined,
  );

  // columns (explicit → fallback to auto; ensure created_by is first where applicable)
  const colsFor = (key, rows) => {
    const r0 = rows?.[0] || {};
    if (key === 'users') return userCols;

    if (key === 'plants') {
      const hasCommonName = Object.prototype.hasOwnProperty.call(r0, 'common_name');
      return hasCommonName ? plantColsExplicit : [createdByCol, ...autoCols(rows)];
    }
    if (key === 'categories') {
      const hasCategory = Object.prototype.hasOwnProperty.call(r0, 'category');
      return hasCategory ? categoryColsExplicit : [createdByCol, ...autoCols(rows)];
    }
    if (key === 'events') {
      const hasEventName = Object.prototype.hasOwnProperty.call(r0, 'event_name');
      return hasEventName ? eventColsExplicit : [createdByCol, ...autoCols(rows)];
    }
    return autoCols(rows);
  };

  const tabs = [
    { label: 'Users', key: 'users', q: usersQ },
    { label: 'Plants', key: 'plants', q: plantsQ },
    { label: 'Categories', key: 'categories', q: catsQ },
    { label: 'Events', key: 'events', q: eventsQ },
  ];

  const t = tabs[tab];
  const rows = t.q.data || [];

  // keep your "mine only" filter
  const mineFiltered = useMemo(() => {
    if (!mineOnly || !user?._id) return rows;
    return rows.filter((r) => {
      const cb = r.created_by;
      const id = typeof cb === 'object' ? cb?._id : cb;
      return id === user._id;
    });
  }, [rows, mineOnly, user?._id]);

  // 🔽 build safe columns + chip filter
  const { cols, filteredRows } = useAutoCols(mineFiltered);

  const loading = t.q.isLoading;

  const handleRowClick = (params) => {
    if (t.key !== 'users') return;
    const u = params?.row;
    if (!u) return;
    setCreatedBy({ _id: u._id || u.id, firstname: u.firstname, lastname: u.lastname });
    setTab(1);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        {createdBy?._id && (
          <Chip
            color="primary"
            variant="outlined"
            label={`Created By: ${[createdBy.firstname, createdBy.lastname]
              .filter(Boolean)
              .join(' ')} (${createdBy._id})`}
            onDelete={() => setCreatedBy(null)}
          />
        )}
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {tabs.map((x) => (
          <Tab key={x.key} label={x.label} />
        ))}
      </Tabs>

      {t.q.error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {`${t.label} error: ${String(t.q.error)}`}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip
          label="Created by me"
          clickable
          color={mineOnly ? 'primary' : 'default'}
          variant={mineOnly ? 'filled' : 'outlined'}
          onClick={() => setMineOnly((v) => !v)}
        />
        <Typography variant="caption" sx={{ alignSelf: 'center', opacity: 0.7 }}>
          Showing {mineOnly ? 'my items' : 'all items'}
        </Typography>
      </Stack>

      <Box sx={{ height: 620 }}>
        {createdByFilter && (
          <Chip
            sx={{ mb: 1 }}
            color="primary"
            variant="outlined"
            label={`Filter: ${createdByFilter}`}
            onDelete={() => setCreatedByFilter(null)}
          />
        )}
        <DataGrid
          rows={filteredRows}
          columns={cols}
          getRowId={(r) => r._id || r.id || r.uuid}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
