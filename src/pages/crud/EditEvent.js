import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { toast } from 'react-toastify';
// import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '../../components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MomentUtils from '@date-io/moment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
// import { getCookie } from '../../utils/helpers';
// import axios from 'axios';
import instance from '../../utils/axiosClient';

const EditEvent = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState(state);
  // const [values, setValues] = useState({
  //   category_id: '',
  //   plant_id: '',
  //   repeat_cycle: '',
  // });


  // useEffect(() => {
  //   setValues({ ...state });
  // }, [state]);

  // setValues({ ...state });
  // const [values, setValues] = useState({
  //   event_name: '',
  //   description: '',
  //   category_id: '',
  //   plant_id: '',
  //   occurs_at: null,
  //   month: '',
  //   repeat_cycle: '',
  //   repeat_frequency: 0,
  //   notes: '',
  //   // buttonText: 'Sign Up',
  // });

  const [ categories, setCategories ] = useState([]);
  const [ plants, setPlants ] = useState([]);

  // Handle form values and set to state
  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log('Select event', event.currentTarget);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const {
          data: { allCategories },
        } = await instance.get(`/categories`);
        console.log('SUCCESS CATEGORIES', allCategories);
        setCategories(allCategories)
      }catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/categories')
      }
  };
    getCategories();
  }, [navigate]);

  useEffect(() => {
    const getPlants = async () => {
      try {
        const {
          data: { allPlants },
        } = await instance.get(`/plants`);
        console.log('SUCCESS PLANT', allPlants);
        setPlants(allPlants);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/plants');
      }
    };
    getPlants();
  }, [navigate]);

  console.log('STATE', state);

  const category_id = state.category._id;
  const category_name = state.category.category || '';
  const plant_id = state.plant._id || '';
  const plant_name = state.plant.common_name || '';

  console.log('values.plant_id typeof', typeof values.plant_id);
  // const { event_name, description, occurs_at, month, repeat_cycle, repeat_frequency, notes } = state;

  // useEffect(() => {
  //   setValues(prev => ({ ...prev,
  //     event_name,
  //     description,
  //     category_id,
  //     plant_id,
  //     occurs_at,
  //     month,
  //     repeat_cycle,
  //     repeat_frequency,
  //     notes,
  //      }));
  // }, []);
  useEffect(() => {
    setValues(prev => ({ ...prev,
      category_id: state.category._id,
      plant_id: state.plant._id
     }));
  }, [state.category._id, state.plant._id]);

console.log('saved_state_values', values);

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values });
    // console.log('SUBMIT VALUES', values);
      try {
        const {
          data: { updatedEvent },
        } = await instance.put(`/event/update/${values.id}`, {
          event_name: values.event_name,
          description: values.description,
          category: values.category_id,
          plant: values.plant_id,
          occurs_at: values.occurs_at,
          month: values.month,
          repeat_cycle: values.repeat_cycle,
          repeat_frequency: values.repeat_frequency,
          notes: values.notes,
        });
        // console.log('SUCCESS', updatedEvent);
        setValues({ ...values });
        toast.success(`Event "${updatedEvent.event_name}" updated successfully`);
        navigate('/events');
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
      }
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
          <h1>Edit Event Page</h1>
          {/* Start form here */}

          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}>
            <LocalizationProvider
              utils={MomentUtils}
              dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete='event_name'
                    value={values.event_name}
                    name='event_name'
                    required
                    helperText='Required'
                    fullWidth
                    id='event_name'
                    label='Event Name'
                    size='small'
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={values.description}
                    id='description'
                    label='Description'
                    name='description'
                    autoComplete='description'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth sx={{ minWidth: 120 }} size='small'>
                    <InputLabel id='category_id'>Category</InputLabel>
                    <Select
                      labelId='category_id'
                      id='category_id'
                      name='category_id'
                      value={ values?.category_id || '' }
                      label='Category'
                      onChange={handleValues}
                      >
                      <MenuItem value={''}>
                        <em>None</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth sx={{ minWidth: 120 }} size='small'>
                    <InputLabel id='plant_id'>Plant</InputLabel>
                    <Select
                      labelId='plant_id'
                      id='plant_id'
                      name='plant_id'
                      value={values?.plant_id || ''}
                      label='Plant'
                      onChange={handleValues}
                      >
                      <MenuItem value={''}>
                        <em>None</em>
                      </MenuItem>
                      {plants.map((plant) => (
                        <MenuItem key={plant._id} value={plant._id}>
                          {plant.common_name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label='Occurs at'
                    name='occurs_at'
                    id='occurs_at'
                    value={values.occurs_at}
                    inputFormat='dd/MM/yyyy'
                    onChange={newValue => {
                      setValues({ ...values, occurs_at: newValue });
                    }}
                    renderInput={params => (
                      <TextField required helperText="Required" size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label='Occurs to'
                    name='occurs_to'
                    id='occurs_to'
                    value={values.occurs_to}
                    inputFormat='dd/MM/yyyy'
                    onChange={newValue => {
                      setValues({ ...values, occurs_to: newValue });
                    }}
                    renderInput={params => (
                      <TextField size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    // defaultValue={0}
                    value={values.repeat_frequency}
                    name='repeat_frequency'
                    type='number'
                    InputProps={{ inputProps: { min: 0, max: 26 } }}
                    fullWidth
                    id='repeat_frequency'
                    label='Repeats Every'
                    size='small'
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{}} size='small'>
                    <InputLabel id='repeat_cycle'>Repeat Cycle</InputLabel>
                    <Select
                      labelId='repeat_cycle'
                      id='repeat_cycle'
                      name='repeat_cycle'
                      value={values.repeat_cycle}
                      label='Unit of time'
                      onChange={handleValues}>
                      <MenuItem value={''}>
                        <em>''</em>
                      </MenuItem>
                      <MenuItem value={'Day'}>Day</MenuItem>
                      <MenuItem value={'Week'}>Week</MenuItem>
                      <MenuItem value={'Month'}>Month</MenuItem>
                      <MenuItem value={'Year'}>Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    // required
                    fullWidth
                    multiline
                    rows={4}
                    value={values.notes}
                    name='notes'
                    label='Notes'
                    id='notes'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Update Event
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link
                  component={RouterLink}
                  sx={{ color: 'secondary.main' }}
                  to='/events'
                  variant='body2'>
                  Back to events
                </Link>
              </Grid>
            </Grid>
          </Box>

          {/* End form here */}
          {/* {values.name}
          <Button
            color='primary'
            variant='outlined'
            size='small'
            onClick={() => navigate(-1)}>
            <ArrowBackIos fontSize='small' />
            Back
          </Button> */}
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EditEvent;
