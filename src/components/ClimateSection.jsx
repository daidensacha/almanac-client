import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ClimateZones from '@/images/climate-zones.png';
import Link from '@mui/material/Link';

const ClimateSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        <Grid container>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box
              component="img"
              sx={{
                mr: 1,
                top: 5,
                mx: 'auto',
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
              alt="Climate Zones"
              src={ClimateZones}
            />
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} sx={{ pb: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h3" align="center" color="text.primary" gutterBottom>
                Climate Zones
              </Typography>
              <Typography
                // variant='h6'
                align="left"
                sx={{ px: 4, mb: 2 }}
                color="text.secondary"
                variant="body1"
              >
                At the end of the 19th century, a botanist Wladimir Koeppen developed a climate
                classification system based on annual and monthly temperature and rainfall averages.
                The Köppen-Geiger classification system is still used today and is the basis for the
                climate zones used in this application.
              </Typography>
              <Typography align="left" sx={{ px: 4, mb: 2 }} color="text.secondary" variant="body1">
                Five main climate zones contain a further 30 sub-zones defining differences in
                weather. Scientists use this system widely today to map global changes in weather
                patterns.
              </Typography>

              <Typography align="left" sx={{ px: 4, mb: 2 }} color="text.secondary" variant="body1">
                Knowing and understanding the weather patterns for your locale is an excellent basis
                for growing success. The knowledge helps you understand the types of plants that
                grow in your climate zone and the intricacies of the weather where you live. Growing
                what you can at home can help to reduce the ecological footprint.
              </Typography>
              <Typography align="left" sx={{ px: 4, mb: 2 }} color="text.secondary" variant="body1">
                Growing at home is fun, healthy, saves you money, and is beneficial for the
                environment.
              </Typography>
              <Typography align="left" sx={{ px: 4 }} color="secondary.dark" variant="body1">
                <Link
                  href="https://geodiode.com/climate/koppen-classification/"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: 'secondary.main' }}
                >
                  Educational resource (inlcludes great 10 minute video).
                </Link>
              </Typography>
              <Typography align="left" sx={{ px: 4 }} variant="body1">
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
