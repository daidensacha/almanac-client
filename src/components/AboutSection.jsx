import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import WaSunset from '@/images/wa-sunset.jpg';

const AboutSection = () => {
  return (
    <Box
      component="section"
      sx={{ bgcolor: 'background.paper', pt: { xs: 6, md: 8 }, pb: { xs: 5, md: 6 } }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={WaSunset}
              alt="Warm sunset over a Western Australian landscape"
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
          </Grid>

          {/* Copy */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" align="center" color="text.primary" gutterBottom>
              About Me
            </Typography>

            {/* Apply responsive horizontal padding once */}
            <Box sx={{ px: { xs: 0, sm: 2, md: 4 } }}>
              <Typography variant="subtitle1" color="text.secondary" align="justify" sx={{ mb: 2 }}>
                Take the man out of the country, but you can’t take the country out of the man.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                My forebears were farmers who migrated from Germany to Australia in the early 1800s,
                where our family still has farms.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                In 2015 I moved from Australia to Bavaria, where I now live. I’m a hobby gardener
                with a small vegetable patch and a good selection of fruit trees.
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Growing up in the vast space of the Australian bush, I have a deep affinity with
                nature. I created this app to improve my understanding of climate zones and to grow
                my own fruit and vegetables.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
