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
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1}}>
          <Box
            component="img"
            sx={{ mr: 1, top: 5, mx: 'auto', display: 'block', width: '100%', height: 'auto' }}
            alt="Climate Zones"
            src={ClimateZones}
          />
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2}} sx={{ pb:3 }}>
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
              sx={{ px: 4}}
              color='text.secondary'
              component='p'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              posuere consectetur est at lobortis. Praesent commodo cursus
              magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus
              vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia
              bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
              scelerisque nisl consectetur et. Donec sed odio dui. Donec
              ullamcorper nulla non metus auctor fringilla.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClimateSection;
