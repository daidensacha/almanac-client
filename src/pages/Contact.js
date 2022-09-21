import AnimatedPage from '../components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { Link as RouterLink } from 'react-router-dom';

const Contact = () => {
  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      firstname: data.get('firstName'),
      lastname: data.get('lastName'),
      email: data.get('email'),
      message: data.get('message'),
    });
  };

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xs'>
        <Box
          sx={{
            marginTop: 8,
            minHeight: 'calc(100vh - 345px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <MailOutlineIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Contact Us
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='given-name'
                  name='firstName'
                  required
                  fullWidth
                  id='firstName'
                  label='First Name'
                  size="small"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='lastName'
                  label='Last Name'
                  name='lastName'
                  autoComplete='family-name'
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name='message'
                  label='Message'
                  id='message'
                  size="small"
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Submit Message
            </Button>
            <Grid container justifyContent='flex-end' sx={{mb: 4}}>
              {/* <Grid item>
                <Link component={RouterLink} to='/login' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Contact;
