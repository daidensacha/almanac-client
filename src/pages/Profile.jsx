// src/pages/Profile.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import RoomIcon from '@mui/icons-material/Room';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import AnimatedPage from '@/components/AnimatedPage';
import instance from '@/utils/axiosClient';
import climateZoneData from '@/data/climate-zone';
import { updateUser, setLocalStorage, removeLocalStorage } from '@/utils/helpers';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
const toNumOrEmpty = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
};

const hasCoords = (lat, lon) =>
  Number.isFinite(Number(lat)) &&
  Number.isFinite(Number(lon)) &&
  Number(lat) !== 0 &&
  Number(lon) !== 0;

const GEO_OPTS_PRIMARY = { enableHighAccuracy: false, timeout: 5000, maximumAge: 120000 };
const GEO_OPTS_RETRY = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

function getPosition(opts) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}

function watchOnce(watchTimeoutMs = 6000, opts = GEO_OPTS_RETRY) {
  return new Promise((resolve, reject) => {
    let cleared = false;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        if (!cleared) {
          cleared = true;
          navigator.geolocation.clearWatch(id);
          resolve(pos);
        }
      },
      () => {}, // ignore; fall back to timeout
      opts,
    );
    setTimeout(() => {
      if (!cleared) {
        cleared = true;
        navigator.geolocation.clearWatch(id);
        reject(Object.assign(new Error('watch timeout'), { code: 3 }));
      }
    }, watchTimeoutMs);
  });
}

export default function Profile() {
  const navigate = useNavigate();

  // global auth user
  // (setUser may or may not exist in your context; we guard its usage)
  const { user: authUser, signout, setUser: setAuthUser } = useAuthContext();

  // local editable profile
  const [userProfile, setUserProfile] = useState({
    role: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  // location + zone
  const [location, setLocation] = useState({
    loading: false,
    error: false,
    code: 0,
    message: '',
    latitude: '',
    longitude: '',
    koppen_geiger_zone: '',
    zone_description: '',
  });

  // show/hide location consent
  const [checked, setChecked] = useState(false);

  // auto/manual mode
  const [locMode, setLocMode] = useState('auto'); // 'auto' | 'manual'
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');

  // for “Climate Zone Info” card
  const [userZone, setUserZone] = useState(JSON.parse(localStorage.getItem('userZone')) || {});

  // stale-guard ref for async geolocation attempts
  const attemptRef = useRef(0);

  // ────────────────────────────────────────────────────────────────────────────
  // Geolocation flow
  // ────────────────────────────────────────────────────────────────────────────
  const successPosition = (pos) => {
    const { latitude, longitude } = pos.coords || {};
    setLocation((s) => ({
      ...s,
      loading: false,
      error: false,
      code: 0,
      message: '',
      latitude,
      longitude,
    }));
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      getClimateZone(latitude, longitude);
    }
  };

  const errorPosition = (err) => {
    const code = err?.code ?? 4;
    const msg =
      code === 1
        ? 'Please enable location services'
        : code === 2
        ? 'Location unavailable'
        : code === 3
        ? 'Location request timed out'
        : 'Unknown location error';
    setLocation((s) => ({ ...s, loading: false, error: true, code, message: msg }));
  };

  async function getCurrentLocation() {
    if (!('geolocation' in navigator)) {
      setLocation((s) => ({ ...s, error: true, message: 'Geolocation not supported' }));
      return;
    }
    setLocation((s) => ({ ...s, loading: true, error: false, message: '' }));

    try {
      const pos1 = await getPosition(GEO_OPTS_PRIMARY);
      successPosition(pos1);
      return;
    } catch (err1) {
      if (err1?.code !== 2 && err1?.code !== 3) {
        errorPosition(err1);
        return;
      }
    }

    try {
      const pos2 = await getPosition(GEO_OPTS_RETRY);
      successPosition(pos2);
      return;
    } catch (err2) {
      try {
        const pos3 = await watchOnce(6000, GEO_OPTS_RETRY);
        successPosition(pos3);
        return;
      } catch (err3) {
        errorPosition(err2);
      }
    } finally {
      setLocation((s) => ({ ...s, loading: false }));
    }
  }

  // fetch zone from server by coords
  const getClimateZone = async (latitude, longitude) => {
    setLocation((s) => ({ ...s, loading: true }));
    try {
      const {
        data: { climateZone },
      } = await instance.get(`/climate-zone/${latitude}/${longitude}`);
      const { koppen_geiger_zone, zone_description } = climateZone.return_values?.[0] || {};
      setLocation((prev) => ({
        ...prev,
        loading: false,
        koppen_geiger_zone: koppen_geiger_zone || '',
        zone_description: zone_description || '',
        message: '',
        error: false,
      }));
    } catch (err) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: true,
        message: 'Could not fetch climate zone. Please try again.',
      }));
      toast.error('Could not fetch climate zone. Please try again.');
      console.log(err);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Effects: compute userZone card, load profile
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = location.koppen_geiger_zone;
    if (checked && sub) {
      const found = climateZoneData.find((z) => z.subZone === sub);
      if (found) {
        setUserZone(found);
        setLocalStorage('userZone', found);
      } else {
        setUserZone({});
        removeLocalStorage('userZone');
      }
    } else {
      setUserZone({});
      removeLocalStorage('userZone');
    }
  }, [checked, location.koppen_geiger_zone]);

  useEffect(() => {
    (async () => {
      try {
        const id = authUser?._id;
        if (!id) return;
        const { data } = await instance.get(`/user/${id}`); // axiosClient carries Bearer
        const {
          role,
          firstname,
          lastname,
          email,
          show_location,
          latitude,
          longitude,
          koppen_geiger_zone,
          zone_description,
        } = data || {};

        setUserProfile((prev) => ({ ...prev, role, firstname, lastname, email }));
        setLocation((prev) => ({
          ...prev,
          latitude,
          longitude,
          koppen_geiger_zone,
          zone_description,
          message: '',
          error: false,
        }));
        setChecked(!!show_location);
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            await signout();
          } finally {
            navigate('/signin', { replace: true });
          }
          toast.error(err.response.data?.error || 'Session expired');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if user flips to AUTO while ON and we have no coords yet, try fetch
  useEffect(() => {
    if (checked && locMode === 'auto') {
      const haveCoords =
        Number.isFinite(Number(location.latitude)) && Number.isFinite(Number(location.longitude));
      if (!haveCoords) {
        getCurrentLocation();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locMode, checked]);

  // ────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────────────────────────────────
  const handleChecked = async (e) => {
    const on = e.target.checked;
    setChecked(on);

    if (!on) {
      // OFF → clear data and *force next ON to Auto*
      setLocMode('auto');
      setManualLat('');
      setManualLon('');
      setLocation((s) => ({
        ...s,
        loading: false,
        error: false,
        code: 0,
        message: '',
        latitude: '',
        longitude: '',
        koppen_geiger_zone: '',
        zone_description: '',
      }));
      return;
    }

    // ON
    const haveCoords = hasCoords(location.latitude, location.longitude);

    if (!haveCoords) {
      setLocMode('auto');
      setLocation((s) => ({ ...s, loading: true, error: false, message: '' }));
      await getCurrentLocation();
      return;
    }

    if (locMode === 'manual') {
      setLocation((s) => ({ ...s, loading: true, error: false, message: '' }));
      try {
        await getClimateZone(Number(location.latitude), Number(location.longitude));
      } finally {
        setLocation((s) => ({ ...s, loading: false }));
      }
    } else {
      setLocation((s) => ({ ...s, loading: true, error: false, message: '' }));
      await getCurrentLocation();
    }
  };

  const handleLocModeChange = async (_, next) => {
    if (!next) return;
    setLocMode(next);
    if (!checked) return;

    if (next === 'auto') {
      setLocation((s) => ({ ...s, loading: true, message: '' }));
      await getCurrentLocation();
    } else {
      setLocation((s) => ({
        ...s,
        message: hasCoords(location.latitude, location.longitude)
          ? ''
          : 'Enter coords and press Resolve zone',
        error: false,
      }));
    }
  };

  const resolveManualZone = async () => {
    const la = Number(manualLat);
    const lo = Number(manualLon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      setLocation((s) => ({ ...s, error: true, message: 'Enter valid numbers' }));
      return;
    }
    setLocation((s) => ({ ...s, loading: true, message: '' }));
    try {
      setLocation((s) => ({ ...s, latitude: la, longitude: lo }));
      await getClimateZone(la, lo);
    } catch {
      setLocation((s) => ({ ...s, error: true, message: 'Could not resolve zone' }));
    } finally {
      setLocation((s) => ({ ...s, loading: false }));
    }
  };

  const handleUserChange = (e) => {
    setUserProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { firstname, lastname, password } = userProfile;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserProfile((u) => ({ ...u, buttonText: 'Submitting' }));

    const payload = {
      firstname,
      lastname,
      show_location: checked,
      latitude: checked
        ? locMode === 'manual'
          ? toNumOrEmpty(manualLat)
          : toNumOrEmpty(location.latitude)
        : null,
      longitude: checked
        ? locMode === 'manual'
          ? toNumOrEmpty(manualLon)
          : toNumOrEmpty(location.longitude)
        : null,
      koppen_geiger_zone: checked ? location.koppen_geiger_zone || null : null,
      zone_description: checked ? location.zone_description || null : null,
    };

    const trimmedPwd = (password || '').trim();
    if (trimmedPwd) payload.password = trimmedPwd;

    try {
      const res = await instance.patch('/user/update', payload, { withCredentials: true });
      updateUser(res, () => {
        setUserProfile((prev) => ({ ...prev, buttonText: 'Submit', ...res.data }));
        if (typeof setAuthUser === 'function') setAuthUser(res.data);
        toast.success('Profile updated successfully');
      });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to update profile';
      setUserProfile((u) => ({ ...u, buttonText: 'Submit' }));
      toast.error(msg);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <AnimatedPage>
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          minHeight: 'calc(100vh - 345px)',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            mt: 8,
            maxWidth: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  value={userProfile.firstname || ''}
                  name="firstname"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  size="small"
                  autoFocus
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  value={userProfile.lastname || ''}
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="family-name"
                  size="small"
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={userProfile.email || ''}
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  value={userProfile.password || ''}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  size="small"
                  onChange={handleUserChange}
                />
              </Grid>
            </Grid>

            {/* Climate Zone */}
            <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', mt: 5 }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <GpsFixedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Climate Zone
              </Typography>

              {location.loading && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress color="secondary" />
                </Box>
              )}

              <Box
                component="div"
                sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'space-between' }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      name="show_location"
                      id="show_location"
                      checked={checked}
                      onChange={handleChecked}
                    />
                  }
                  label={checked ? 'Remove location' : 'Show location'}
                />

                <ToggleButtonGroup
                  exclusive
                  color="primary"
                  value={locMode}
                  onChange={handleLocModeChange}
                  size="small"
                  sx={{ my: 2 }}
                >
                  <ToggleButton value="manual">
                    <RoomIcon sx={{ mr: 1 }} /> Manual
                  </ToggleButton>
                  <ToggleButton value="auto">
                    <GpsFixedIcon sx={{ mr: 1 }} /> Auto
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {/* Coordinates + zone */}
            <Grid container spacing={2} pt={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  id="latitude"
                  name="latitude"
                  size="small"
                  value={!checked ? '' : locMode === 'manual' ? manualLat : location.latitude ?? ''}
                  onChange={(e) => {
                    if (locMode === 'manual') setManualLat(e.target.value);
                  }}
                  disabled={!checked || locMode === 'auto'}
                  placeholder={!checked ? '-' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  id="longitude"
                  name="longitude"
                  size="small"
                  value={
                    !checked ? '' : locMode === 'manual' ? manualLon : location.longitude ?? ''
                  }
                  onChange={(e) => {
                    if (locMode === 'manual') setManualLon(e.target.value);
                  }}
                  disabled={!checked || locMode === 'auto'}
                  placeholder={!checked ? '-' : ''}
                />
              </Grid>

              {checked && locMode === 'manual' && (
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={resolveManualZone}>
                    Resolve zone from coords
                  </Button>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={checked ? location.koppen_geiger_zone || '' : ''}
                  label="Climate Zone"
                  id="koppen_geiger_zone"
                  name="koppen_geiger_zone"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={checked ? location.zone_description || '' : ''}
                  label="Zone Description"
                  id="zone_description"
                  name="zone_description"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>

              {!!location.message && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color={location.error ? 'error.main' : 'warning.main'}
                    sx={{ mt: 1 }}
                  >
                    {location.message}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Profile
            </Button>
          </Box>
        </Box>

        {/* Climate Zone Info (pretty card) */}
        <Box sx={{ mt: 4, mb: 3, maxWidth: 'sm', width: '100%' }}>
          <Grid
            container
            justifyContent="center"
            sx={{ display: 'flex', flexDirection: 'column', md: 8 }}
          >
            <Typography component="h1" variant="h5" align="center">
              Climate Zone Info
            </Typography>
            <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Zone:</Box> {userZone.group}
            </Typography>
            <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Subzone:</Box>{' '}
              {userZone.subZone}
            </Typography>
            <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Heat Level:</Box>{' '}
              {userZone.heatLevel}
            </Typography>
            <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Precipitation:</Box>{' '}
              {userZone.precipitationType}
            </Typography>
            <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Short Description:</Box>{' '}
              {userZone.shortDescription}
            </Typography>
            <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Long Description:</Box>{' '}
              {userZone.longDescription}
            </Typography>
          </Grid>
        </Box>

        {/* (Optional) Manual coords dialog placeholder */}
        <Dialog open={false} onClose={() => {}}>
          <DialogTitle>Set Coordinates Manually</DialogTitle>
          <DialogContent />
          <DialogActions>
            <Button>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AnimatedPage>
  );
}
