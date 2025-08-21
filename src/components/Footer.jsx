import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@mui/material';
// import { grey } from '@mui/material/colors';

const FooterSection = () => {
  return (
    <Box
      sx={{ bgcolor: 'grey.900', color: 'grey.500' }}
      px={{ xs: 3, sm: 10 }}
      py={{ xs: 5, sm: 5 }}>
      <Container>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Box borderBottom={1}>Help</Box>
            <Box>
              <Link color='primary.dark' component={RouterLink} to='/contact'>
                Support
              </Link>
            </Box>
            <Box>
              <Link color='primary.dark' component={RouterLink} to='/contact'>
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box borderBottom={1}>Account</Box>
            <Box>
              <Link color='primary.dark' component={RouterLink} to='/signin'>
                Sign in
              </Link>
            </Box>
            <Box>
              <Link color='primary.dark' component={RouterLink} to='/signup'>
                Register
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box borderBottom={1}>Info</Box>
            <Box>
              <Link
                color='primary.dark'
                href='https://www.mindat.org/climate.php'
                target='_blank'>
                Climate Zones
              </Link>
            </Box>
            <Box>
              <Link
                color='primary.dark'
                href='https://www.almanac.com/'
                target='_blank'>
                Old Farmers Almanac
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box textAlign='center' pt={{ xs: 5, sm: 5 }} pb={{ xs: 2, sm: 0 }}>
          <Typography variant='body2' color='grey.500'>
            Garden Almanac &reg; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection;
