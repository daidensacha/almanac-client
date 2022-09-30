import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ClimateZones from '../images/climate-zones.png';

const ClimateSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}>
      <Container maxWidth='xl'>
        <Grid container>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box
              component='img'
              sx={{
                mr: 1,
                top: 5,
                mx: 'auto',
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
              alt='Climate Zones'
              src={ClimateZones}
            />
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} sx={{ pb: 3 }}>
            <Typography
              variant='h3'
              align='center'
              color='text.primary'
              gutterBottom>
              Climate Zones
            </Typography>
            <Typography
              // variant='h6'
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              In the end of the 19th century, Wladimir Koeppen developed a
              climate classification system based on the annual and monthly
              averages of temperature and precipitation. This system is still
              used today and is the basis for the climate zones used in this
              application. The climate zones are based on the Köppen-Geiger
              climate classification system.
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              The climate zones are divided into 5 categories: A, B, C, D and E.
              A is the warmest and E is the coldest.
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              A: Tropical
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              B: Dry
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              C: Temperate
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              D: Continental
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              E: Polar
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              The climate zones are further divided into 6 subcategories based
              on the amount of precipitation and the temperature. The
              subcategories are denoted by a letter after the main category. The
              subcategories are as follows:
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              a: Hot and dry b: Hot and wet c: Warm and dry d: Warm and wet e:
              Cold and dry f: Cold and wet
            </Typography>
            <Typography
              align='left'
              sx={{ px: 4 }}
              color='text.secondary'
              component='p'>
              Growing vegetables at home used to be common, however it has
              become less common in recent years. This is due to the fact that
              many people live in apartments and do not have access to a garden.
              In addition, many people do not have the time to grow their own
              vegetables. This application aims to make it easier for people to
              grow their own vegetables at home. It reduces your footprint and
              helps you to eat healthier. It also helps you to save money.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClimateSection;
