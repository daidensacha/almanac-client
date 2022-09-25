import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LinearProgress from '@mui/material/LinearProgress';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';
import climateZoneData from '../data/climate-zone';
import { getCookie, isAuth, signout, updateUser, setLocalStorage, removeLocalStorage } from '../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Profile = () => {
  const navigate = useNavigate();
  let userZoneInititial = JSON.parse(localStorage.getItem('userZone')) || { };


  // Set state for form data
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // set the default values for the form
  const [user, setUser] = useState({
    role: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  // Set the state of the user climate zone
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

  // Set the state of the user climate zone data
  // const [userZone, setUserZone] = useState({
  //   subzone: '',
  //   group: '',
  //   color: '',
  //   backgroundColor: '',
  //   precipitationType: '',
  //   heatLevel: '',
  //   shortDescription: '',
  //   longDesription: '',
  // });
   const [userZone, setUserZone] = useState(userZoneInititial);

  // const {latitude, longitude} = location;
  // Fetch climage zone data for users location
  const getClimateZone = async (latitude, longitude) => {
    setLoading(true);
    const url = `http://climateapi.scottpinkelman.com/api/v1/location/${latitude}/${longitude}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const { koppen_geiger_zone, zone_description } = data.return_values[0];
      setLocation(prevState => ({
        ...prevState,
        loading: false,
        koppen_geiger_zone: `${koppen_geiger_zone}`,
        zone_description: `${zone_description}`,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Geolocation successCallback
  const successPosition = position => {
    setLocation(prevState => ({
      ...prevState,
      error: false,
      code: 0,
      message: '',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }));
    const { latitude, longitude } = position.coords;
    // Get the climate zone
    getClimateZone(latitude, longitude);
    setLoading(false);
  };

  // Geolocation errorCallback
  const errorPosition = error => {
    let errorMessage = '';
    // Check for error code and handle accordingly with custom message
    switch (error.code) {
      case 1:
        console.error(
          `Error Code: ${error.code} Please enable location services`,
        );
        errorMessage = 'Please enable location services';
        break;
      case 2:
        console.error(
          `Code: ${error.code} Location information is unavailable`,
        );
        errorMessage = 'Location information is unavailable';
        break;
      case 3:
        console.error(
          `Code: ${error.code} The request to get user location timed out`,
        );
        errorMessage = 'The request to get user location timed out';
        break;
      case 4:
        console.error(`Code: ${error.code} An unknown error occurred`);
        errorMessage = 'An unknown error occurred';
        break;
      default:
        console.error('An unknown error occurred');
        errorMessage = 'An unknown error occurred';
    }
    setLocation(prevState => ({
      ...prevState,
      error: true,
      code: error.code,
      message: errorMessage || 'Error getting location',
    }));
    setLoading(false);
  };

  // Get the user's location using the geolocation API
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLocation(prevState => ({
        ...prevState,
        error: true,
        message: 'Geolocation is not supported by this browser.',
      }));
    }
  };

  // removeLocalStorage('userZone')
  // Handle the switch change to load the user's location
  const handleChecked = event => {
    setChecked(event.target.checked);
    event.target.checked ? setLoading(true) : setLoading(false);
    event.target.checked ? getCurrentLocation() : setLoading(false);
    !event.target.checked && setLocation(prevState => ({
      ...prevState,
      latitude: '',
      longitude: '',
      koppen_geiger_zone: '',
      zone_description: ''
    }));
  }

  // Handle the form user input change to load to the users state
  const handleUserChange = event => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  // Handle the form zone input change to load to the climateZone state
  const handleZoneChange = event => {
    setLocation({ ...location, [event.target.name]: event.target.value });
  };


  useEffect(() => {

    const userSubzone = location.koppen_geiger_zone;
    // Get the user's climate zone
    if (userSubzone && checked) {
      const userClimateZone = climateZoneData.find(
        zone => zone.subZone === userSubzone,
      );
      setUserZone(userClimateZone);
      setLocalStorage('userZone', userClimateZone);
    } else {
      removeLocalStorage('userZone');
      setUserZone({});
    }
  }, [location, checked]);
  // console.log('userZone', userZone);



  const token = getCookie('token');

  useEffect(() => {


  const loadProfile = () => {
    // let token = isAuth().token;
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('PRIVATE PROFILE UPDATE', response);
        const {
          role,
          firstname,
          lastname,
          email,
          show_location, // to checked state true or false
          latitude,
          longitude,
          koppen_geiger_zone,
          zone_description,
        } = response.data;
        setUser({ ...user, role, firstname, lastname, email });
        setLocation({
          ...location,
          latitude,
          longitude,
          koppen_geiger_zone,
          zone_description,
        });
        setChecked(show_location);
      })
      .catch(error => {
        console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            navigate('/signin');
          });
          toast.error(error.response.data.error);
        }
      });
  };

  loadProfile();
}, [ ]);

  const { role, firstname, lastname, email, password } = user;
  const show_location = checked;
  const { latitude, longitude, koppen_geiger_zone, zone_description } =
    location;

  const handleSubmit = event => {
    event.preventDefault();
    setUser({ ...user, buttonText: 'Submitting' });
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/user/update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        firstname,
        lastname,
        password,
        show_location,
        latitude,
        longitude,
        koppen_geiger_zone,
        zone_description,
      },
    })
      .then(response => {
        console.log('PRIVATE PROFILE UPDATE SUCCESS', response);
        // save response (user, token) to local storage/cookie
        updateUser(response, () => {
          setUser({
            ...user,
            // buttonText: 'Submitted',
          });
          toast.success('Profile updated successfully');
        });
      })
      .catch(error => {
        console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
        setUser({ ...user, buttonText: 'Submit' });
        toast.error(error.response.data.error);
      });
  };

  return (
    <AnimatedPage>
      <Container
        component='main'
        maxWidth='lg'
        sx={{
          minHeight: 'calc(100vh - 345px)',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <ToastContainer />
        <Box
          sx={{
            marginTop: 8,
            maxWidth: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Profile
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
                  value={user.firstname || ''}
                  name='firstname'
                  required
                  fullWidth
                  id='firstname'
                  label='First Name'
                  size='small'
                  autoFocus
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  value={user.lastname || ''}
                  id='lastname'
                  label='Last Name'
                  name='lastname'
                  autoComplete='family-name'
                  size='small'
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={user.email || ''}
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  size='small'
                  onChange={handleUserChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  value={user.password || ''}
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  size='small'
                  onChange={handleUserChange}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                mt: 5,
              }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <GpsFixedIcon />
              </Avatar>
              <Typography component='h1' variant='h5'>
                Climate Zone
              </Typography>
              <Box component='div' sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch name='show_location' id='show_location' defaultValue={checked} checked={checked} onChange={handleChecked} />
                  }
                  label='Show Location'
                />
                {loading && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress color='secondary' />
                  </Box>
                )}
              </Box>
              <Typography component='h1' variant='h6' color='warning.main'>
                {location.message}
              </Typography>
            </Box>
            <Grid container spacing={2} pt={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  fullWidth
                  value={location.latitude || ''}
                  name='latitude'
                  id='latitude'
                  label='Latitude'
                  size='small'
                  onChange={handleZoneChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  fullWidth
                  value={location.longitude || ''}
                  id='longitude'
                  label='Longitude'
                  name='longitude'
                  size='small'
                  onChange={handleZoneChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={location.koppen_geiger_zone || ''}
                  id='koppen_geiger_zone'
                  label='Climate Zone'
                  name='koppen_geiger_zone'
                  size='small'
                  onChange={handleZoneChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  value={location.zone_description || ''}
                  name='zone_description'
                  label='Zone Description'
                  id='zone_description'
                  size='small'
                  onChange={handleZoneChange}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Update Profile
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Box>
        {/* Display the users climate zone information */}
        <Box sx={{ mt: 4, mb: 3, maxWidth: 'sm', width: '100%' }}>
          <Grid
            container
            justifyContent='center'
            sx={{ display: 'flex', flexDirection: 'column', md: 8 }}>
            <Typography component='h1' variant='h5' align='center'>
              Climate Zone Info
            </Typography>
            <Typography
              component='h6'
              variant='body1'
              sx={{ color: 'secondary.light' }}>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>
                Zone:
              </Box>{' '}
              {userZone.group}
            </Typography>
            <Typography
              component='h6'
              variant='body1'
              sx={{ color: 'secondary.light' }}
              align='left'>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>
                Subzone:
              </Box>{' '}
              {userZone.subZone}
            </Typography>
            <Typography
              component='h6'
              variant='body1'
              sx={{ color: 'secondary.light' }}
              align='left'>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>
                Heat Level:
              </Box>{' '}
              {userZone.heatLevel}
            </Typography>
            <Typography
              component='h6'
              variant='body1'
              sx={{ color: 'secondary.light' }}
              align='left'>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>
                Precipitation:
              </Box>{' '}
              {userZone.precipitationType}
            </Typography>
            <Typography
              component='h6'
              variant='body1'
              sx={{ color: 'secondary.light' }}
              align='left'>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>
                Short Description:
              </Box>{' '}
              {userZone.shortDescription}
            </Typography>
            <Typography
              component='h6'
              variant='body1'
              sx={{ color: 'secondary.light' }}
              align='left'>
              <Box sx={{ display: 'inline', color: 'secondary.dark' }}>
                Long Description:
              </Box>{' '}
              {userZone.longDescription}
            </Typography>
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Profile;
