// src/pages/admin/Admin.jsx
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

export default function AdminLayout() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Outlet />
    </Container>
  );
}
