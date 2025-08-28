import { Container, Typography } from '@mui/material';
import AnimatedPage from '@/components/AnimatedPage';

export default function Faq() {
  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          FAQ
        </Typography>
        <Typography variant="body1" paragraph>
          This is the FAQ page. Add your frequently asked questions here.
        </Typography>
      </Container>
    </AnimatedPage>
  );
}
