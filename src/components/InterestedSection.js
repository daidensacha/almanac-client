import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';

const InterestedSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'secondary.dark',
        pt: 8,
        pb: 6,
      }}>
      <Container maxWidth='xl'>
        <Grid container spacing={4} justifyContent='center'>
          <Grid item xs={12} md={3}>
            <Typography
              variant='h5'
              align='center'
              color='secondary.contrastText'
              gutterBottom>
              Questions or suggestions?
            </Typography>
            <Typography
              variant='body1'
              align='left'
              color='secondary.contrastText'
              >
              I'm open to hear from you if you have any questions or suggestions
              for the app. I'm also interested in hearing about your gardening
              or farming experiences. Please contact me through the contact form
              on the{' '}
              <Link style={{ color: 'white' }} to='/contact'>
                contact page
              </Link>
              .
            </Typography>
          </Grid>
          <Grid item md={1} justifyContent='center'>
            <Divider
              orientation='vertical'
              style={{ height: '100%', width: '50%', borderColor: 'white' }}
              flexItem
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography
              variant='h5'
              align='center'
              color='secondary.contrastText'
              gutterBottom>
              Want to contribute?
            </Typography>
            <Typography
              variant='body1'
              align='left'
              color='secondary.contrastText'
              >
              I'm interested developing this project to help people understand
              climate change and how to mitigate it. If you're interested in
              helping, please reach out to me. I'm looking for developers,
              designers, and writers. I'm also looking for people to help with
              outreach and marketing.
            </Typography>
          </Grid>

          <Grid item md={1}>
            <Divider
              orientation='vertical'
              style={{
                height: '100%',
                width: '50%',
                borderColor: 'white',
              }}
              flexItem
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography
              variant='h5'
              align='center'
              color='secondary.contrastText'
              gutterBottom>
              Ready to get started?
            </Typography>
            <Typography
              variant='body1'
              align='left'
              color='secondary.contrastText'
              >
              Every Journey starts with a single step. If you're ready to get
              started, please sign up for an account. Your participation will
              help us all understand climate change and how to mitigate it. You
              can also sign up for the newsletter to get updates on the project.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InterestedSection;
