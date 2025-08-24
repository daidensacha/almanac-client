// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        404 – Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Go Home
      </Button>
    </Box>
  );
}
