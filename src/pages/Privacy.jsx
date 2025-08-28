import { Container, Typography } from '@mui/material';
import AnimatedPage from '@/components/AnimatedPage';

export default function Privacy() {
  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Describe your privacy practices here.
        </Typography>
      </Container>
    </AnimatedPage>
  );
}
