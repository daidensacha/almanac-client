import { useMemo, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

// --- helpers ---
function normalizeUsers(payload) {
  // bare array
  if (Array.isArray(payload)) return payload;
  // common wrappers
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.allUsers)) return payload.allUsers;
  // paginated shapes
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function autoCols(rows) {
  if (!rows?.length) return [];
  const omit = new Set(['password', 'hash', '__v', 'token']);
  const sample = rows[0];
  return Object.keys(sample)
    .filter((k) => !omit.has(k))
    .map((k) => ({
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
    }));
}

// --- data hooks ---
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/users'); // axios has baseURL + withCredentials
        console.log('[Users] raw:', res.status, res.data);
        return normalizeUsers(res.data);
      } catch (err) {
        const status = err?.response?.status;
        const body = err?.response?.data;
        console.error('[Users] error:', status, body || err.message);
        throw err;
      }
    },
    retry: false,
    staleTime: 60000,
  });
}

// change usePatchUser to axios (keeps Bearer header)
function usePatchUser(path) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }) => {
      const { data } = await api.patch(`/admin/users/${id}/${path}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export default function Users() {
  const { data = [], isLoading, error } = useUsers();
  const suspend = usePatchUser('status');
  const role = usePatchUser('role');
  const reset = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/admin/users/${id}/reset-password`);
      return data;
    },
  });

  useEffect(() => {
    console.log('[Users] normalized:', data);
  }, [data]);

  // If your API uses `created_at` instead of `createdAt`, these explicit columns may render blanks.
  // We’ll auto-fallback when fields aren’t present.
  const explicitCols = useMemo(
    () => [
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
      {
        field: 'role',
        headerName: 'Role',
        width: 120,
        renderCell: (p) => <Chip label={p.value ?? ''} size="small" />,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 140,
        renderCell: (p) => (
          <Chip
            label={p.value ?? ''}
            color={p.value === 'suspended' ? 'warning' : 'success'}
            size="small"
          />
        ),
      },
      {
        field: 'created_at',
        headerName: 'Created',
        width: 180, // try snake_case first
        valueGetter: (p) =>
          p.row.created_at
            ? new Date(p.row.created_at).toLocaleString()
            : p.row.createdAt
            ? new Date(p.row.createdAt).toLocaleString()
            : '',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 380,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                suspend.mutate({
                  id: row._id || row.id,
                  body: { status: row.status === 'suspended' ? 'active' : 'suspended' },
                })
              }
            >
              {row.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
            </Button>
            <Button size="small" onClick={() => reset.mutate(row._id || row.id)}>
              Reset Password
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() =>
                role.mutate({
                  id: row._id || row.id,
                  body: { role: row.role === 'admin' ? 'user' : 'admin' },
                })
              }
            >
              {row.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
            </Button>
          </Stack>
        ),
      },
    ],
    [suspend, role, reset],
  );

  // If explicit fields don’t exist on the first row, fallback to auto-generated columns.
  const columns = useMemo(() => {
    const rows = data || [];
    const first = rows[0] || {};
    const hasEmail = Object.prototype.hasOwnProperty.call(first, 'email');
    const hasName =
      Object.prototype.hasOwnProperty.call(first, 'name') ||
      Object.prototype.hasOwnProperty.call(first, 'username') ||
      Object.prototype.hasOwnProperty.call(first, 'display_name');
    const hasStatus = Object.prototype.hasOwnProperty.call(first, 'status');
    const hasRole = Object.prototype.hasOwnProperty.call(first, 'role');
    const goodForExplicit = hasEmail && hasName && (hasStatus || hasRole);
    return goodForExplicit ? explicitCols : autoCols(rows);
  }, [data, explicitCols]);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          Users load error: {String(error?.response?.status || error.message)}
        </Typography>
      )}
      <DataGrid
        rows={data}
        getRowId={(r) => r._id || r.id || r.uuid}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
    </Box>
  );
}
