import AnimatedPage from '../components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { authenticate, isAuth } from '../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signin = () => {
  const [values, setValues] = useState({
    email: 'daidensacha@gmail.com',
    password: 'Dsacha123',
    buttonText: 'Sign In',
  });

  const { email, password, buttonText } = values;

  // Handle form values and set to state
  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle form submit
  const handleSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: '...Signing In' });
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then(response => {
        console.log('SIGNIN SUCCESS', response);

        // Save the response (user, token) to local storage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: '',
            password: '',
            buttonText: 'Signed In',
          });
          toast.success(`Hey ${response.data.user.firstname}, Welcome back!`);

        });

      })
      .catch(error => {
        console.log('SIGNIN ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Sign In' });
        toast.error(error.response.data.error);
      });
  };

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xs'>
        <ToastContainer />
        {isAuth() && <Navigate replace to='/' />}
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
            Sign in
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
              value={email}
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              size='small'
              onChange={handleValues}
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              value={password}
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              size='small'
              onChange={handleValues}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              {buttonText}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to='/forgot-password'
                  variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to='/signup' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Signin;
