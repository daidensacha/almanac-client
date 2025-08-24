// src/pages/Forbidden.jsx
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h2" gutterBottom>
        403
      </Typography>
      <Typography variant="h5" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sorry, you don’t have permission to view this page.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to Home
      </Button>
    </Box>
  );
};

export default Forbidden;
