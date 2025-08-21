import AnimatedPage from '@/components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isExpired, decodeToken } from 'react-jwt';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Activate = () => {
  const jwtToken = useParams().token;

  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstname: '',
    token: '',
    expired: true,
    show: true,
  });

  const { firstname, token, expired } = values;

  useEffect(() => {
    const token = jwtToken;
    const { firstname } = decodeToken(jwtToken);
    const expired = isExpired(jwtToken);
    // console.log('firstname', firstname)
    // console.log('expiredToken', expired)
    // console.log('token',token)
    if (token) {
      setValues({ ...values, firstname, token, expired });
    }
  }, [jwtToken, values]);

  // Handle form submit
  const clickSubmit = (event) => {
    event.preventDefault();
    axios({
      method: 'POST',
      url: `${import.meta.env.VITE_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log('ACCOUNT ACTIVATION', response);
        setValues({
          ...values,
          show: false,
        });
        toast.success(response.data.message);
        navigate('/signin');
        // setTimeout(() => navigate('/signin'), 2000);
      })
      .catch((error) => {
        console.log('ACCOUNT ACTIVATION ERROR', error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            minHeight: 'calc(100vh - 345px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <ManageAccountsIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account Activation
          </Typography>
          <Box marginTop={3} alignItems="center">
            <Typography variant="caption1" align="center" color="secondary.main" gutterBottom>
              Hey {firstname},{' '}
              {expired
                ? '...oops, the activation token has expired'
                : 'ready to activate your account?'}
            </Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={clickSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            Activate Account
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              {expired && (
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{ color: 'primary.dark' }}
                >
                  Back to signup page.
                </Link>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Activate;
