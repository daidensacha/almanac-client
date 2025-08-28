import { Container, Typography } from '@mui/material';
import AnimatedPage from '@/components/AnimatedPage';

export default function About() {
  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          About Garden Almanac
        </Typography>
        <Typography variant="body1" paragraph>
          Write about your project, vision, or story here.
        </Typography>
      </Container>
    </AnimatedPage>
  );
}
