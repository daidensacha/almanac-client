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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signup = () => {
  const [values, setValues] = useState({
    firstname: 'Daiden',
    lastname: 'Sacha',
    email: 'daidensacha@gmail.com',
    password: 'Dsacha123',
    buttonText: 'Sign Up',
  });

  const { firstname, lastname, email, password, buttonText } = values;

  // Handle form values and set to state
  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle form submit
  const handleSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: '...Signing Up' });
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signup`,
      data: { firstname, lastname, email, password },
    })
      .then(response => {
        console.log('SIGNUP SUCCESS', response);
        setValues({
          ...values,
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          buttonText: 'Signed Up',
        });
        toast.success(response.data.message);
      })
      .catch(error => {
        console.log('SIGNUP ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Sign Up' });
        toast.error(error.response.data.error);
      });
  };

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xs'>
        <ToastContainer />
        <Box
          sx={{
            marginTop: 8,
            minHeight: 'calc(100vh - 345px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
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
                  value={firstname}
                  name='firstname'
                  required
                  fullWidth
                  id='firstname'
                  label='First Name'
                  size='small'
                  autoFocus
                  onChange={handleValues}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  value={lastname}
                  id='lastname'
                  label='Last Name'
                  name='lastname'
                  autoComplete='family-name'
                  size='small'
                  onChange={handleValues}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={email}
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  size='small'
                  onChange={handleValues}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={password}
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  size='small'
                  onChange={handleValues}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              {buttonText}
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link component={RouterLink} to='/signin' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Signup;
