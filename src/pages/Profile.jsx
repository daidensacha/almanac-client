import { useState, useEffect } from 'react';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import AnimatedPage from '@/components/AnimatedPage';
import climateZoneData from '@/data/climate-zone';
import instance from '@/utils/axiosClient'; // single axios instance
import {
  getCookie,
  isAuth,
  signout,
  updateUser, // helper that writes localStorage (you already had this)
  setLocalStorage,
  removeLocalStorage,
} from '@/utils/helpers';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Profile = () => {
  const navigate = useNavigate();
  const token = getCookie('token');

  // 🔐 global auth user from context
  const { user: authUser, setUser: setAuthUser } = useAuthContext();

  // 📝 local editable form state (renamed)
  const [userProfile, setUserProfile] = useState({
    role: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  // 🌍 location + climate
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

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [userZone, setUserZone] = useState(JSON.parse(localStorage.getItem('userZone')) || {});

  // ---------- Geolocation helpers (unchanged) ----------
  const GEO_OPTS_PRIMARY = { enableHighAccuracy: false, timeout: 5000, maximumAge: 120000 };
  const GEO_OPTS_RETRY = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

  const getClimateZone = async (latitude, longitude) => {
    setLoading(true);
    try {
      const {
        data: { climateZone },
      } = await instance.get(`/climate-zone/${latitude}/${longitude}`);
      const { koppen_geiger_zone, zone_description } = climateZone.return_values[0] || {};
      setLocation((prev) => ({
        ...prev,
        loading: false,
        koppen_geiger_zone: `${koppen_geiger_zone || ''}`,
        zone_description: `${zone_description || ''}`,
      }));
    } catch (err) {
      toast.error('Could not fetch climate zone. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const successPosition = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation((prev) => ({
      ...prev,
      error: false,
      code: 0,
      message: '',
      latitude,
      longitude,
    }));
    getClimateZone(latitude, longitude);
    setLoading(false);
  };

  const errorPosition = (error) => {
    const map = {
      1: 'Please enable location services',
      2: 'Location information is unavailable',
      3: 'The request to get user location timed out',
      4: 'An unknown error occurred',
    };
    setLocation((prev) => ({
      ...prev,
      error: true,
      code: error.code,
      message: map[error.code] || 'An unknown error occurred',
    }));
    setLoading(false);
  };

  function getPosition(opts) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, opts);
    });
  }
  function watchOnce(watchTimeoutMs = 8000, opts = GEO_OPTS_RETRY) {
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
        () => {},
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
  async function getCurrentLocation() {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({ ...prev, error: true, message: 'Geolocation not supported' }));
      return;
    }
    setLoading(true);
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
      } catch {
        errorPosition(err2);
      }
    } finally {
      setLoading(false);
    }
  }

  // ---------- Toggles ----------
  const handleChecked = (event) => {
    const on = event.target.checked;
    setChecked(on);
    if (on) {
      setLoading(true);
      getCurrentLocation();
    } else {
      setLoading(false);
      setLocation((s) => ({
        ...s,
        latitude: '',
        longitude: '',
        koppen_geiger_zone: '',
        zone_description: '',
      }));
      setUserZone({});
      removeLocalStorage('userZone');
    }
  };

  // ---------- Form handlers (renamed) ----------
  const handleUserChange = (event) => {
    setUserProfile((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleZoneChange = (event) => {
    setLocation((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // ---------- Compute zone card ----------
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

  // ---------- Load profile on mount ----------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const id = authUser?._id || isAuth()?._id; // fallback if context not yet populated
        if (!id) return;

        const { data } = await instance.get(`/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
        }));
        setChecked(!!show_location);
      } catch (err) {
        if (err.response?.status === 401) {
          signout(() => navigate('/signin'));
          toast.error(err.response.data.error);
        }
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Submit ----------
  const { firstname, lastname, password } = userProfile;
  const show_location = checked;
  const { latitude, longitude, koppen_geiger_zone, zone_description } = location;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserProfile((u) => ({ ...u, buttonText: 'Submitting' }));

    const payload = {
      firstname,
      lastname,
      show_location,
      latitude,
      longitude,
      koppen_geiger_zone,
      zone_description,
    };
    const trimmedPwd = (password || '').trim();
    if (trimmedPwd) payload.password = trimmedPwd;

    try {
      const res = await instance.patch('/user/update', payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // ✅ write localStorage via helper
      updateUser(res, () => {
        // ✅ update local form + global context
        setUserProfile((prev) => ({ ...prev, buttonText: 'Submit', ...res.data }));
        setAuthUser(res.data);
        toast.success('Profile updated successfully');
      });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to update profile';
      console.log('PRIVATE PROFILE UPDATE ERROR', msg);
      setUserProfile((u) => ({ ...u, buttonText: 'Submit' }));
      toast.error(msg);
    }
  };

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
            marginTop: 8,
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

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  onChange={handleUserChange}
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

            <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', mt: 5 }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <GpsFixedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Climate Zone
              </Typography>
              <Box component="div" sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="show_location"
                      id="show_location"
                      checked={checked}
                      onChange={handleChecked}
                    />
                  }
                  label="Show Location"
                />
                {loading && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress color="secondary" />
                  </Box>
                )}
              </Box>
              <Typography component="h1" variant="h6" color="warning.main">
                {location.message}
              </Typography>
            </Box>

            <Grid container spacing={2} pt={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  fullWidth
                  value={location.latitude || ''}
                  name="latitude"
                  id="latitude"
                  label="Latitude"
                  size="small"
                  onChange={handleZoneChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  fullWidth
                  value={location.longitude || ''}
                  id="longitude"
                  label="Longitude"
                  name="longitude"
                  size="small"
                  onChange={handleZoneChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={location.koppen_geiger_zone || ''}
                  id="koppen_geiger_zone"
                  label="Climate Zone"
                  name="koppen_geiger_zone"
                  size="small"
                  onChange={handleZoneChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={location.zone_description || ''}
                  name="zone_description"
                  label="Zone Description"
                  id="zone_description"
                  size="small"
                  onChange={handleZoneChange}
                />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Profile
            </Button>
          </Box>
        </Box>

        {/* Climate Zone Info */}
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
            <Typography
              component="h6"
              variant="body1"
              sx={{ color: 'secondary.light' }}
              align="left"
            >
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Subzone:</Box>{' '}
              {userZone.subZone}
            </Typography>
            <Typography
              component="h6"
              variant="body1"
              sx={{ color: 'secondary.light' }}
              align="left"
            >
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Heat Level:</Box>{' '}
              {userZone.heatLevel}
            </Typography>
            <Typography
              component="h6"
              variant="body1"
              sx={{ color: 'secondary.light' }}
              align="left"
            >
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Precipitation:</Box>{' '}
              {userZone.precipitationType}
            </Typography>
            <Typography
              component="h6"
              variant="body1"
              sx={{ color: 'secondary.light' }}
              align="left"
            >
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Short Description:</Box>{' '}
              {userZone.shortDescription}
            </Typography>
            <Typography
              component="h6"
              variant="body1"
              sx={{ color: 'secondary.light' }}
              align="left"
            >
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Long Description:</Box>{' '}
              {userZone.longDescription}
            </Typography>
          </Grid>
        </Box>

        {/* Manual Lat/Lon dialog placeholders if you need them later */}
        <Dialog open={manualOpen} onClose={() => setManualOpen(false)}>
          <DialogTitle>Set Coordinates Manually</DialogTitle>
          <DialogContent>{/* Fields for manualLat/manualLon if you want */}</DialogContent>
          <DialogActions>
            <Button onClick={() => setManualOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AnimatedPage>
  );
};

export default Profile;

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import instance from '../utils/axiosClient';
// import GpsFixedIcon from '@mui/icons-material/GpsFixed';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import LinearProgress from '@mui/material/LinearProgress';
// import AnimatedPage from '@/components/AnimatedPage';
// import axios from 'axios';
// import climateZoneData from '@/data/climate-zone';
// import {
//   getCookie,
//   isAuth,
//   signout,
//   updateUser,
//   setLocalStorage,
//   removeLocalStorage,
// } from '../utils/helpers';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import api from '@utils/axiosClient';
// import { useAuthContext } from '@/contexts/AuthContext';

// const Profile = () => {
//   const navigate = useNavigate();
//   let userZoneInititial = JSON.parse(localStorage.getItem('userZone')) || {};

//   const { setUser } = useAuthContext();

//   const GEO_OPTS_PRIMARY = {
//     enableHighAccuracy: false,
//     timeout: 5000,
//     maximumAge: 120000,
//   }; // allow a cached fix up to 2 min
//   const GEO_OPTS_RETRY = {
//     enableHighAccuracy: true,
//     timeout: 10000,
//     maximumAge: 0,
//   }; // force a fresh fix

//   // Set state for form data
//   const [loading, setLoading] = useState(false);
//   const [checked, setChecked] = useState(false);

//   // set the default values for the form
//   const [user, setUser] = useState({
//     role: '',
//     firstname: '',
//     lastname: '',
//     email: '',
//     password: '',
//   });

//   // const [user, setUser] = useState({
//   //   role: '',
//   //   firstname: '',
//   //   lastname: '',
//   //   email: '',
//   //   password: '',
//   // });

//   // Set the state of the user climate zone
//   const [location, setLocation] = useState({
//     loading: false,
//     error: false,
//     code: 0,
//     message: '',
//     latitude: '',
//     longitude: '',
//     koppen_geiger_zone: '',
//     zone_description: '',
//   });

//   const [manualOpen, setManualOpen] = useState(false);
//   const [manualLat, setManualLat] = useState('');
//   const [manualLon, setManualLon] = useState('');

//   // Set the state of the user climate zone data
//   const [userZone, setUserZone] = useState(userZoneInititial);

//   const getClimateZone = async (latitude, longitude) => {
//     setLoading(true);
//     try {
//       const {
//         data: { climateZone },
//       } = await instance.get(`/climate-zone/${latitude}/${longitude}`);
//       console.log('SUCCESS climateZone', climateZone);
//       const { koppen_geiger_zone, zone_description } = climateZone.return_values[0];
//       setLocation((prevState) => ({
//         ...prevState,
//         loading: false,
//         koppen_geiger_zone: `${koppen_geiger_zone}`,
//         zone_description: `${zone_description}`,
//       }));
//       setLoading(false);
//     } catch (err) {
//       toast.error('Could not fetch climate zone. Please try again.');
//       console.log(err);
//     }
//   };

//   const successPosition = (position) => {
//     setLocation((prevState) => ({
//       ...prevState,
//       error: false,
//       code: 0,
//       message: '',
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude,
//     }));
//     const { latitude, longitude } = position.coords;
//     // Get the climate zone
//     getClimateZone(latitude, longitude);
//     setLoading(false);
//   };

//   // Geolocation errorCallback
//   const errorPosition = (error) => {
//     let errorMessage = '';
//     // Check for error code and handle accordingly with custom message
//     switch (error.code) {
//       case 1:
//         console.error(`Error Code: ${error.code} Please enable location services`);
//         errorMessage = 'Please enable location services';
//         break;
//       case 2:
//         console.error(`Code: ${error.code} Location information is unavailable`);
//         errorMessage = 'Location information is unavailable';
//         break;
//       case 3:
//         console.error(`Code: ${error.code} The request to get user location timed out`);
//         errorMessage = 'The request to get user location timed out';
//         break;
//       case 4:
//         console.error(`Code: ${error.code} An unknown error occurred`);
//         errorMessage = 'An unknown error occurred';
//         break;
//       default:
//         console.error('An unknown error occurred');
//         errorMessage = 'An unknown error occurred';
//     }
//     setLocation((prevState) => ({
//       ...prevState,
//       error: true,
//       code: error.code,
//       message: errorMessage || 'Error getting location',
//     }));
//     setLoading(false);
//   };

//   function getPosition(opts) {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(resolve, reject, opts);
//     });
//   }

//   // optional: short-lived watch fallback (helps on some devices)
//   // resolves on first success or after `watchTimeoutMs`
//   function watchOnce(watchTimeoutMs = 8000, opts = GEO_OPTS_RETRY) {
//     return new Promise((resolve, reject) => {
//       let cleared = false;
//       const id = navigator.geolocation.watchPosition(
//         (pos) => {
//           if (!cleared) {
//             cleared = true;
//             navigator.geolocation.clearWatch(id);
//             resolve(pos);
//           }
//         },
//         (err) => {
//           // do nothing; we’ll time out unless a success arrives
//         },
//         opts,
//       );

//       setTimeout(() => {
//         if (!cleared) {
//           cleared = true;
//           navigator.geolocation.clearWatch(id);
//           reject(Object.assign(new Error('watch timeout'), { code: 3 }));
//         }
//       }, watchTimeoutMs);
//     });
//   }

//   async function getCurrentLocation() {
//     if (!('geolocation' in navigator)) {
//       setLocation((prev) => ({
//         ...prev,
//         error: true,
//         message: 'Geolocation not supported',
//       }));
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1) Try quick, possibly cached fix (fastest path)
//       const pos1 = await getPosition(GEO_OPTS_PRIMARY);
//       successPosition(pos1);
//       return;
//     } catch (err1) {
//       // only retry on UNAVAILABLE (2) or TIMEOUT (3)
//       if (err1?.code !== 2 && err1?.code !== 3) {
//         errorPosition(err1);
//         return;
//       }
//     }

//     try {
//       // 2) Try a high-accuracy fresh fix
//       const pos2 = await getPosition(GEO_OPTS_RETRY);
//       successPosition(pos2);
//       return;
//     } catch (err2) {
//       // 3) As a last resort, briefly watch for a first fix
//       try {
//         const pos3 = await watchOnce(6000, GEO_OPTS_RETRY);
//         successPosition(pos3);
//         return;
//       } catch (err3) {
//         errorPosition(err2); // surface the previous meaningful error
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleChecked = (event) => {
//     const on = event.target.checked;
//     setChecked(on);
//     if (on) {
//       setLoading(true);
//       getCurrentLocation();
//     } else {
//       setLoading(false);
//       setLocation((s) => ({
//         ...s,
//         latitude: '',
//         longitude: '',
//         koppen_geiger_zone: '',
//         zone_description: '',
//       }));
//       setUserZone({});
//       removeLocalStorage('userZone');
//     }
//   };

//   // Handle the form user input change to load to the users state
//   const handleUserChange = (event) => {
//     setUser({ ...user, [event.target.name]: event.target.value });
//   };

//   // Handle the form zone input change to load to the climateZone state
//   const handleZoneChange = (event) => {
//     setLocation({ ...location, [event.target.name]: event.target.value });
//   };

//   useEffect(() => {
//     const sub = location.koppen_geiger_zone;
//     if (checked && sub) {
//       const found = climateZoneData.find((z) => z.subZone === sub);
//       if (found) {
//         setUserZone(found);
//         setLocalStorage('userZone', found);
//       } else {
//         setUserZone({});
//         removeLocalStorage('userZone');
//       }
//     } else {
//       setUserZone({});
//       removeLocalStorage('userZone');
//     }
//   }, [checked, location.koppen_geiger_zone]);

//   const token = getCookie('token');

//   useEffect(() => {
//     const loadProfile = () => {
//       axios({
//         method: 'GET',
//         url: `${import.meta.env.VITE_API}/user/${isAuth()._id}`,
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then(({ data }) => {
//           const {
//             role,
//             firstname,
//             lastname,
//             email,
//             show_location,
//             latitude,
//             longitude,
//             koppen_geiger_zone,
//             zone_description,
//           } = data;
//           setUser((prev) => ({ ...prev, role, firstname, lastname, email }));
//           setLocation((prev) => ({
//             ...prev,
//             latitude,
//             longitude,
//             koppen_geiger_zone,
//             zone_description,
//           }));
//           setChecked(!!show_location);
//         })
//         .catch((err) => {
//           if (err.response?.status === 401) {
//             signout(() => navigate('/signin'));
//             toast.error(err.response.data.error);
//           }
//         });
//     };
//     loadProfile();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const { firstname, lastname, password } = user;
//   const show_location = checked;
//   const { latitude, longitude, koppen_geiger_zone, zone_description } = location;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUser((u) => ({ ...u, buttonText: 'Submitting' }));

//     const payload = {
//       firstname,
//       lastname,
//       show_location,
//       latitude,
//       longitude,
//       koppen_geiger_zone,
//       zone_description,
//     };

//     // only include password if user actually entered one
//     const trimmedPwd = (password || '').trim();
//     if (trimmedPwd) payload.password = trimmedPwd;

//     try {
//       // prefer PATCH for partial updates (use PUT if your server requires it)
//       const res = await api.patch('/user/update', payload, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });

//       console.log('PRIVATE PROFILE UPDATE SUCCESS', res);
//       updateUser(res, () => {
//         setUser((u) => ({ ...u, buttonText: 'Submit' }));
//         toast.success('Profile updated successfully');
//       });
//     } catch (err) {
//       const msg = err?.response?.data?.error || err?.message || 'Failed to update profile';
//       console.log('PRIVATE PROFILE UPDATE ERROR', msg);
//       setUser((u) => ({ ...u, buttonText: 'Submit' }));
//       toast.error(msg);
//     }
//   };

//   return (
//     <AnimatedPage>
//       <Container
//         component="main"
//         maxWidth="lg"
//         sx={{
//           minHeight: 'calc(100vh - 345px)',
//           alignItems: 'center',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <Box
//           sx={{
//             marginTop: 8,
//             maxWidth: 'sm',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Profile
//           </Typography>
//           <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   autoComplete="given-name"
//                   value={user.firstname || ''}
//                   name="firstname"
//                   required
//                   fullWidth
//                   id="firstname"
//                   label="First Name"
//                   size="small"
//                   autoFocus
//                   onChange={handleUserChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   value={user.lastname || ''}
//                   id="lastname"
//                   label="Last Name"
//                   name="lastname"
//                   autoComplete="family-name"
//                   size="small"
//                   onChange={handleUserChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   disabled
//                   fullWidth
//                   value={user.email || ''}
//                   id="email"
//                   label="Email Address"
//                   name="email"
//                   autoComplete="email"
//                   size="small"
//                   onChange={handleUserChange}
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   value={user.password || ''}
//                   name="password"
//                   label="Password"
//                   type="password"
//                   id="password"
//                   autoComplete="new-password"
//                   size="small"
//                   onChange={handleUserChange}
//                 />
//               </Grid>
//             </Grid>
//             <Box
//               sx={{
//                 alignItems: 'center',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 mt: 5,
//               }}
//             >
//               <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//                 <GpsFixedIcon />
//               </Avatar>
//               <Typography component="h1" variant="h5">
//                 Climate Zone
//               </Typography>
//               <Box component="div" sx={{ mt: 3 }}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       name="show_location"
//                       id="show_location"
//                       // defaultValue={checked}
//                       checked={checked}
//                       onChange={handleChecked}
//                     />
//                   }
//                   label="Show Location"
//                 />
//                 {loading && (
//                   <Box sx={{ width: '100%' }}>
//                     <LinearProgress color="secondary" />
//                   </Box>
//                 )}
//               </Box>
//               <Typography component="h1" variant="h6" color="warning.main">
//                 {location.message}
//               </Typography>
//             </Box>
//             <Grid container spacing={2} pt={3}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   disabled
//                   fullWidth
//                   value={location.latitude || ''}
//                   name="latitude"
//                   id="latitude"
//                   label="Latitude"
//                   size="small"
//                   onChange={handleZoneChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   disabled
//                   fullWidth
//                   value={location.longitude || ''}
//                   id="longitude"
//                   label="Longitude"
//                   name="longitude"
//                   size="small"
//                   onChange={handleZoneChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   disabled
//                   fullWidth
//                   value={location.koppen_geiger_zone || ''}
//                   id="koppen_geiger_zone"
//                   label="Climate Zone"
//                   name="koppen_geiger_zone"
//                   size="small"
//                   onChange={handleZoneChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   disabled
//                   fullWidth
//                   value={location.zone_description || ''}
//                   name="zone_description"
//                   label="Zone Description"
//                   id="zone_description"
//                   size="small"
//                   onChange={handleZoneChange}
//                 />
//               </Grid>
//             </Grid>
//             <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//               Update Profile
//             </Button>
//             <Grid container justifyContent="flex-end">
//               <Grid item></Grid>
//             </Grid>
//           </Box>
//         </Box>
//         {/* Display the users climate zone information */}
//         <Box sx={{ mt: 4, mb: 3, maxWidth: 'sm', width: '100%' }}>
//           <Grid
//             container
//             justifyContent="center"
//             sx={{ display: 'flex', flexDirection: 'column', md: 8 }}
//           >
//             <Typography component="h1" variant="h5" align="center">
//               Climate Zone Info
//             </Typography>
//             <Typography component="h6" variant="body1" sx={{ color: 'secondary.light' }}>
//               <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Zone:</Box> {userZone.group}
//             </Typography>
//             <Typography
//               component="h6"
//               variant="body1"
//               sx={{ color: 'secondary.light' }}
//               align="left"
//             >
//               <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Subzone:</Box>{' '}
//               {userZone.subZone}
//             </Typography>
//             <Typography
//               component="h6"
//               variant="body1"
//               sx={{ color: 'secondary.light' }}
//               align="left"
//             >
//               <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Heat Level:</Box>{' '}
//               {userZone.heatLevel}
//             </Typography>
//             <Typography
//               component="h6"
//               variant="body1"
//               sx={{ color: 'secondary.light' }}
//               align="left"
//             >
//               <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Precipitation:</Box>{' '}
//               {userZone.precipitationType}
//             </Typography>
//             <Typography
//               component="h6"
//               variant="body1"
//               sx={{ color: 'secondary.light' }}
//               align="left"
//             >
//               <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Short Description:</Box>{' '}
//               {userZone.shortDescription}
//             </Typography>
//             <Typography
//               component="h6"
//               variant="body1"
//               sx={{ color: 'secondary.light' }}
//               align="left"
//             >
//               <Box sx={{ display: 'inline', color: 'secondary.dark' }}>Long Description:</Box>{' '}
//               {userZone.longDescription}
//             </Typography>
//           </Grid>
//         </Box>
//       </Container>
//     </AnimatedPage>
//   );
// };

// export default Profile;
