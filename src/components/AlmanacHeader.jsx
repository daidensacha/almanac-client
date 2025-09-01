import { Box, Button, ButtonGroup, Container, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AlmanacHeader({ title = 'Almanac' }) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <Container component="section" maxWidth="xl" sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <ButtonGroup variant="outlined" color="secondary" size="small" aria-label="section links">
          <Button
            onClick={() => nav('/plants')}
            variant={pathname.startsWith('/plants') ? 'contained' : 'outlined'}
          >
            PLANTS
          </Button>
          <Button
            onClick={() => nav('/events')}
            variant={pathname.startsWith('/events') ? 'contained' : 'outlined'}
          >
            EVENTS
          </Button>
          <Button
            onClick={() => nav('/categories')}
            variant={pathname.startsWith('/categories') ? 'contained' : 'outlined'}
          >
            CATEGORIES
          </Button>
        </ButtonGroup>
      </Box>
    </Container>
  );
}
