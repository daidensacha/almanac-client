import AnimatedPage from '@/components/AnimatedPage';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PASSWORD_REGEX, PASSWORD_MESSAGE } from '@daidensacha/almanac-shared';
// This needs to me move to shared!!!
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;

const ResetPassword = () => {
  const { token } = useParams(); // route: /reset-password/:token
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // Guard: token must be present
  useEffect(() => {
    if (!token) {
      toast.error('Reset link is missing or invalid. Please request a new one.');
      // You could navigate('/forgot-password') here if you prefer.
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (!PASSWORD_REGEX.test(password)) {
      toast.error(PASSWORD_MESSAGE);
      return;
    }
    if (password !== confirm) {
      return toast.error('Passwords do not match.');
    }

    setLoading(true);
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API}/reset-password`, {
        token,
        newPassword: password,
      });
      toast.success(data.message || 'Password reset. Please sign in.');
      navigate('/signin', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Reset link invalid or expired';
      toast.error(msg);
    } finally {
      setLoading(false);
      setPassword('');
      setConfirm('');
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            mb: 4,
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
            Reset Password
          </Typography>
          <Typography component="p" variant="body2" sx={{ mt: 3 }} color="text.secondary">
            Enter a new password to reset your account.
          </Typography>

          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm"
              label="Confirm New Password"
              type="password"
              id="confirm"
              autoComplete="new-password"
              size="small"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !token}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </Button>
            <Grid container />
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default ResetPassword;
