import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CropsAerial1 from '@/images/crops_aerial_1.jpg';

const TriviaSection = () => {
  return (
    <Box
      sx={{
        // bgcolor: 'background.paper',
        bgcolor: 'primary.light',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h3" align="center" color="text.primary" gutterBottom>
                Did you know?
              </Typography>
              <Typography variant="body1" align="left" color="text.secondary" gutterBottom sx={{}}>
                The Old Farmer’s Almanac has been continuously published in the United States since
                1792. It is the oldest continuously published periodical in the United States and
                the second oldest continuously published periodical in North America.
              </Typography>
              <Typography variant="body1" align="left" color="text.secondary" gutterBottom>
                The historical data, handed down for generations, is priceless for farmers and hobby
                gardeners alike. The process of recording events and exprerience benefits everyone.
              </Typography>
              <Typography variant="body1" align="left" color="text.secondary" gutterBottom>
                An Almanac is a great resource for learning about the weather and climate in your
                area.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                sx={{ maxWidth: '100%', height: 'auto' }}
                alt="image"
                src={CropsAerial1}
              ></Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TriviaSection;
