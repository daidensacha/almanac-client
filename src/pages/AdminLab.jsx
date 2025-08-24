import { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import instance from '@/utils/axiosClient';

const AdminLab = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkPing = async () => {
    try {
      const { data } = await instance.get('/admin/ping');
      setResult(data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
      setResult(null);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Admin Lab
        </Typography>

        <Button variant="contained" onClick={checkPing}>
          Call /api/admin/ping
        </Button>

        {result && (
          <pre style={{ marginTop: 16, background: '#111', color: '#9fe', padding: 12 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

        {error && <Typography sx={{ color: 'error.main', mt: 2 }}>Error: {error}</Typography>}
      </CardContent>
    </Card>
  );
};

export default AdminLab;
