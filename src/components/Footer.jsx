// src/components/Footer.jsx
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useWeather } from '@/utils/useWeather';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const FooterSection = () => {
  const now = new Date();
  const { profile, showLocation, lat, lon, hasGeo } = useProfile();
  const { data: weather } = useWeather({ lat, lon, enabled: hasGeo });

  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const year = now.getFullYear();
  let leftSegment;
  if (showLocation && hasGeo && weather) {
    leftSegment = (
      <>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
            alt={weather.desc || 'weather'}
            width={20}
            height={20}
            style={{ verticalAlign: 'middle' }}
          />
        )}
        {Math.round(Number(weather.temp))}°C — {weather.city} <span>•</span>
      </>
    );
  } else {
    leftSegment = (
      <>
        Location off <span>•</span>
      </>
    );
  }

  return (
    <Box
      sx={{ bgcolor: 'grey.900', color: 'grey.500' }}
      px={{ xs: 3, sm: 10 }}
      py={{ xs: 4, sm: 4 }}
    >
      <Container>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Box borderBottom={1}>Help</Box>
            <Box>
              <Link color="primary.dark" component={RouterLink} to="/contact">
                Support
              </Link>
            </Box>
            <Box>
              <Link color="primary.dark" component={RouterLink} to="/contact">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box borderBottom={1}>Account</Box>
            <Box>
              <Link color="primary.dark" component={RouterLink} to="/signin">
                Sign in
              </Link>
            </Box>
            <Box>
              <Link color="primary.dark" component={RouterLink} to="/signup">
                Register
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box borderBottom={1}>Info</Box>
            <Box>
              <Link color="primary.dark" href="https://www.mindat.org/climate.php" target="_blank">
                Climate Zones
              </Link>
            </Box>
            <Box>
              <Link color="primary.dark" href="https://www.almanac.com/" target="_blank">
                Old Farmers Almanac
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Status line */}
        {/* <Box textAlign="center" pt={{ xs: 3, sm: 3 }}>
          <Typography
            variant="body2"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
          >
            {leftSegment}
            Local time {timeLabel} <span>•</span> Garden Almanac ® {year}
          </Typography>
        </Box> */}

        <Box sx={{ textAlign: 'center', pt: { xs: 3, sm: 3 } }}>
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'block', sm: 'inline-block' }, // block on xs, inline-block on sm+
              textAlign: 'center',
              whiteSpace: { xs: 'normal', sm: 'nowrap' }, // allow wrapping on xs, prevent on sm+
            }}
          >
            {leftSegment} Local time {timeLabel} • Garden Almanac ® {year}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection;
