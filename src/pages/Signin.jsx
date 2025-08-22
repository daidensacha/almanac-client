import AnimatedPage from '@/components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '@/utils/axiosClient';
import { authenticate, isAuth } from '@/utils/helpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useAuthContext } from '@/contexts/AuthContext';

const Signin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Sign In',
  });

  const { email, password, buttonText } = values;

  // Handle form values and set to state
  const handleValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setValues({ ...values, buttonText: '... Signing In' });
    const response = await api
      .post('/signin', { email, password })
      .then((response) => {
        console.log('SIGNIN SUCCESS', response);
        authenticate(response, () => {
          setValues({
            ...values,
            email: '',
            password: '',
            buttonText: 'Signed In',
          });
          toast.success(`Hey ${response.data.user.firstname}, Welcome!`);
          setUser(true);
          setLoading(false);
          navigate('/', { replace: true });
        });
      })
      .catch((error) => {
        console.log('SIGNIN ERROR', error.response.data);
        setLoading(false);
        setValues({ ...values, buttonText: 'Sign In' });
        toast.error(error.response.data.error);
      });
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        {/* <ToastContainer /> */}
        {isAuth() && <Navigate replace to="/" />}
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={email}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              size="small"
              onChange={handleValues}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              size="small"
              onChange={handleValues}
            />
            <LoadingButton
              type="submit"
              loading={loading}
              loadingPosition="end"
              endIcon={<LoginIcon />}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {buttonText}
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
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
