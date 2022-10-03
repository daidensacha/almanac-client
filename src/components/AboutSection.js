import { StayCurrentLandscapeTwoTone } from '@mui/icons-material';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import WaSunset from '../images/wa-sunset.jpg';

const AboutSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}>
      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component='img'
              sx={{ maxWidth: '100%', height: 'auto' }}
              alt='image'
              src={WaSunset}></Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant='h3'
              sx={{ textAlign: 'center', color: 'text.primary' }}
              gutterBottom>
              About Me
            </Typography>
            <Typography
              variant='subtitle1'
              sx={{
                px: 4,
                color: 'text.secondary',
                textAlign: 'justify',
                mb: 2,
              }}
              gutterBottom>
              Take the man out of the country, but you cant take the country out
              of the man.
            </Typography>
            <Typography
              variant='body1'
              sx={{ px: 4, color: 'text.secondary', textAlign: '' }}
              gutterBottom>
              My forebears were farmers who migrated from Germany to Australia
              in the early 1800's where our family still has farms.
            </Typography>
            <Typography
              variant='body1'
              sx={{ px: 4, color: 'text.secondary', textAlign: '' }}
              gutterBottom>
              In 2015 I moved from Australia to Bavaria where I now live. I am a
              hobby gardener and have a small vegetable garden and good
              selection fruit trees.
            </Typography>
            <Typography
              variant='body1'
              sx={{ px: 4, color: 'text.secondary', textAlign: '' }}
              gutterBottom>
              Growing up in the vast space of the Australian bush, I have a deep
              afinity with nature. I created this app as a way to impove my
              understanding of climate zones, to grow my own fruit and
              vegetables.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
