import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ClimateZones from '@/images/climate-zones.png';

const ClimateSection = () => {
  return (
    <Box component="section" sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          {/* Image */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box
              component="img"
              src={ClimateZones}
              alt="Köppen–Geiger world climate zones map"
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
          </Grid>

          {/* Text */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Typography variant="h3" align="center" color="text.primary" gutterBottom>
              Climate Zones
            </Typography>

            {/* Apply padding once for all paragraphs */}
            <Box sx={{ px: { xs: 0, sm: 2, md: 4 } }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                At the end of the 19th century, botanist Wladimir Köppen developed a climate
                classification system based on annual and monthly temperature and rainfall averages.
                The Köppen–Geiger system is still used today and is the basis for the climate zones
                in this application.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Five main climate zones contain a further 30 sub-zones defining differences in
                weather. Scientists still use this system to map global climate change.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Knowing and understanding the weather patterns for your locale is an excellent
                foundation for growing success. This knowledge helps you choose plants suited to
                your climate and adapt to local weather intricacies.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Growing at home is fun, healthy, saves money, and benefits the environment.
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <Link
                  href="https://geodiode.com/climate/koppen-classification/"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: 'secondary.main' }}
                >
                  Educational resource (includes a great 10-minute video).
                </Link>
              </Typography>

              <Typography variant="body1">
                <Link
                  href="https://earthhow.com/koppen-climate-classification/"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: 'secondary.main' }}
                >
                  Explanation of the climate zones.
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClimateSection;
