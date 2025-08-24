// src/pages/Activate.jsx
import AnimatedPage from '@/components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isExpired, decodeToken } from 'react-jwt';
import api from '@/utils/axiosClient';
import { toast } from 'react-toastify';
import { useAuthContext } from '@/contexts/AuthContext'; // to clear auth after activation
import 'react-toastify/dist/ReactToastify.min.css';

export default function Activate() {
  const { token: jwtToken } = useParams();
  const navigate = useNavigate();
  const { signout } = useAuthContext(); // clears cookie/localStorage/context

  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState({
    firstname: '',
    token: '',
    expired: true,
    show: true,
  });

  const { firstname, token, expired } = state;

  useEffect(() => {
    if (!jwtToken) return;
    try {
      const dec = decodeToken(jwtToken) || {};
      setState((prev) => ({
        ...prev,
        firstname: dec.firstname || '',
        token: jwtToken,
        expired: isExpired(jwtToken),
      }));
    } catch {
      setState((prev) => ({ ...prev, token: jwtToken, expired: true }));
    }
  }, [jwtToken]);

  const clickSubmit = async (e) => {
    e.preventDefault();
    if (!token || expired) return;
    try {
      setSubmitting(true);
      const res = await api.post('/account-activation', { token });
      console.log('ACCOUNT ACTIVATION', res);
      // ensure we are logged OUT so /signin doesn’t bounce to /
      try {
        await signout?.();
      } catch {}
      toast.success(res?.data?.message || 'Account activated');
      navigate('/signin', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Activation failed';
      console.error('ACCOUNT ACTIVATION ERROR', msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 8,
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

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="secondary.main">
              Hey {firstname || 'there'},{' '}
              {expired
                ? '...oops, the activation token has expired'
                : 'ready to activate your account?'}
            </Typography>
          </Box>

          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={clickSubmit}
            disabled={expired || submitting || !token}
            sx={{ mt: 3, mb: 2 }}
          >
            {submitting ? 'Activating…' : 'Activate Account'}
          </Button>

          {expired && (
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{ color: 'primary.dark' }}
                >
                  Back to signup page.
                </Link>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </AnimatedPage>
  );
}

// import AnimatedPage from '@/components/AnimatedPage';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// // import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { isExpired, decodeToken } from 'react-jwt';
// import api from '@/utils/axiosClient';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';

// const Activate = () => {
//   const jwtToken = useParams().token;

//   const navigate = useNavigate();

//   const [values, setValues] = useState({
//     firstname: '',
//     token: '',
//     expired: true,
//     show: true,
//   });

//   const { firstname, token, expired } = values;

//   useEffect(() => {
//     if (!jwtToken) return;
//     try {
//       const { firstname } = decodeToken(jwtToken);
//       const expired = isExpired(jwtToken);

//       setValues((prev) => ({
//         ...prev,
//         firstname,
//         token: jwtToken,
//         expired,
//       }));
//     } catch {
//       // bad/expired token parsing—set an error or ignore
//       setValues((prev) => ({ ...prev, expired: true }));
//     }
//   }, [jwtToken]);

//   const [submitting, setSubmitting] = useState(false);
//   // Handle form submit
//   const clickSubmit = async (e) => {
//     e.preventDefault(); // keep if this is inside a <form>
//     try {
//       setSubmitting(true);
//       const res = await api.post('/account-activation', { token }); // <-- correct endpoint
//       console.log('ACCOUNT ACTIVATION', res);
//       setValues((v) => ({ ...v, show: false }));
//       toast.success(res?.data?.message || 'Account activated');

//       // Use replace so back button doesn’t return to activation page.
//       // setTimeout avoids timing issues with animations/toasts.
//       setTimeout(() => navigate('/signin', { replace: true }), 0);
//     } catch (err) {
//       const msg = err?.response?.data?.error || err.message || 'Activation failed';
//       console.error('ACCOUNT ACTIVATION ERROR', msg);
//       toast.error(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <AnimatedPage>
//       <Container component="main" maxWidth="xs">
//         <Box
//           sx={{
//             marginTop: 8,
//             minHeight: 'calc(100vh - 345px)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <ManageAccountsIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Account Activation
//           </Typography>
//           <Box marginTop={3} alignItems="center">
//             <Typography variant="caption" align="center" color="secondary.main" gutterBottom>
//               Hey {firstname},{' '}
//               {expired
//                 ? '...oops, the activation token has expired'
//                 : 'ready to activate your account?'}
//             </Typography>
//           </Box>
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             onClick={clickSubmit}
//             disabled={expired || submitting}
//             sx={{ mt: 3, mb: 2 }}
//           >
//             {submitting ? 'Activating...' : 'Activate Account'}
//           </Button>
//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               {expired && (
//                 <Link
//                   component={RouterLink}
//                   to="/signup"
//                   variant="body2"
//                   sx={{ color: 'primary.dark' }}
//                 >
//                   Back to signup page.
//                 </Link>
//               )}
//             </Grid>
//           </Grid>
//         </Box>
//       </Container>
//     </AnimatedPage>
//   );
// };

// export default Activate;

// Drop in replacement for above to test
// // src/pages/Activate.jsx
// import { useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { decodeToken, isExpired } from 'react-jwt';
// import { toast } from 'react-toastify';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CircularProgress from '@mui/material/CircularProgress';

// import api from '@/utils/axiosClient';

// export default function Activate() {
//   const { token: jwtToken } = useParams();
//   const navigate = useNavigate();
//   const [submitting, setSubmitting] = useState(false);

//   const firstname = useMemo(() => {
//     if (!jwtToken) return '';
//     try {
//       return decodeToken(jwtToken)?.firstname || '';
//     } catch {
//       return '';
//     }
//   }, [jwtToken]);

//   const expired = useMemo(() => (jwtToken ? isExpired(jwtToken) : true), [jwtToken]);

//   const handleActivate = async (e) => {
//     e?.preventDefault?.();
//     if (!jwtToken) {
//       toast.error('Missing activation token');
//       return;
//     }
//     if (expired) {
//       toast.error('Activation link has expired. Please sign up again.');
//       return;
//     }
//     try {
//       setSubmitting(true);
//       const res = await api.post('/account-activation', { token: jwtToken });
//       toast.success(res?.data?.message || 'Account activated');
//       // Allow toast to draw, then move on
//       setTimeout(() => navigate('/signin', { replace: true }), 0);
//     } catch (err) {
//       const msg = err?.response?.data?.error || err.message || 'Activation failed';
//       toast.error(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const title = expired ? 'Activation link expired' : 'Activate your account';

//   return (
//     <Container maxWidth="sm" sx={{ py: 6 }}>
//       <Card>
//         <CardContent>
//           <Typography variant="h5" gutterBottom>
//             {title}
//           </Typography>

//           {!expired ? (
//             <>
//               {!!firstname && (
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   Hey {firstname}! Click the button below to activate your account.
//                 </Typography>
//               )}
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Button
//                   variant="contained"
//                   onClick={handleActivate}
//                   disabled={submitting}
//                   startIcon={submitting ? <CircularProgress size={16} /> : null}
//                 >
//                   {submitting ? 'Activating…' : 'Activate Account'}
//                 </Button>
//                 <Button variant="text" onClick={() => navigate('/signin')}>
//                   Go to Sign in
//                 </Button>
//               </Box>
//             </>
//           ) : (
//             <>
//               <Typography variant="body2" sx={{ mb: 2 }}>
//                 Your activation link is invalid or has expired. Please sign up again to receive a new
//                 link.
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Button variant="contained" onClick={() => navigate('/signup', { replace: true })}>
//                   Sign up again
//                 </Button>
//                 <Button variant="text" onClick={() => navigate('/')}>Home</Button>
//               </Box>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }
