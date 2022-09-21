import AnimatedPage from '../components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { Link as RouterLink } from 'react-router-dom';

const ResetPassword = () => {
  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      password: data.get('password'),
    });
  };

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xs'>
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Reset Password
          </Typography>
          <Typography component='body2' variant='p' sx={{mt: 3}}>
            Enter a new password to reset.
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              size="small"
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link component={RouterLink} to='/forgot-password' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to='/register' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default ResetPassword;
