import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { toast } from 'react-toastify';
import AnimatedPage from '../../components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MomentUtils from '@date-io/moment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEventsContext } from '../../contexts/EventsContext';
import Events from '../Events';

const AddEvent = () => {

  const { events, setEvents } = useEventsContext();
  // console.log('CONTEXT EVENTS', events);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    event_name: '',
    description: '',
    category_id: '',
    plant_id: '',
    occurs_at: null,
    occurs_to: null,
    repeat_cycle: '',
    repeat_frequency: 0,
    notes: '',
  });

  const [ categories, setCategories ] = useState([]);
  const [ plants, setPlants ] = useState([]);

  // console.log('PLANT ITEM ID', plants[0]._id)

  // console.log('VALUES', values);
  // console.log('SELECTED DATE', selectedDate);

  // const {
  //   event_name,
  //   description,
  //   occurs_at,
  //   occurs_to
  //   repeat_cycle,
  //   repeat_frequency,
  //   notes,
  //   plant_id,
  //   category_id,
  // } = values;

  // Handle form values and set to state
  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    const getCategories = async () => {
      try {
        const {
          data: { allCategories },
        } = await instance.get(`/categories`);
        // console.log('SUCCESS CATEGORIES', allCategories);
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
        // console.log('SUCCESS PLANT', allPlants);
        setPlants(allPlants);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/plants');
      }
    };
    getPlants();
  }, [navigate]);

  // console.log( 'CATEGORIES', categories );
  // console.log( 'PLANTS', plants );
  // console.log('PLANT ITEM ID', plants[0]._id)


  const handleSubmit = event => {
    event.preventDefault();
    setValues({ ...values });
    // console.log('SUBMIT VALUES', values);

    const createEvent = async () => {
      try {
        const {
          data: { newEvent },
        } = await instance.post(`/event/create`, {
          event_name: values.event_name,
          description: values.description,
          occurs_at: values.occurs_at,
          month: values.month,
          repeat_cycle: values.repeat_cycle,
          repeat_frequency: values.repeat_frequency,
          notes: values.notes,
          category: values.category_id, // category_id selected from dropdown
          plant: values.plant_id, // plant_id selected from dropdown
        });
        // console.log('SUCCESS EVENT', newEvent);
        setEvents(events => [...events, newEvent]);
        toast.success('Event created successfully');
        navigate('/events');
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
      }
    }
    createEvent();

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
          <h1>Add Event</h1>
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
                      value={values.category_id}
                      label='Category'
                      onChange={handleValues}
                      >
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
                      value={values.plant_id}
                      label='Plant'
                      onChange={handleValues}>
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
                    value={values.repeat_frequency}
                    name='repeat_frequency'
                    type='number'
                    InputProps={{ inputProps: { min: 0, max: 26 } }}
                    fullWidth
                    id='repeat_frequency'
                    label='Repeats Every'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{}} size='small'>
                    <InputLabel id='repeat_frequency'>Repeat Cycle</InputLabel>
                    <Select
                      labelId='repeat_cycle'
                      id='repeat_cycle'
                      name='repeat_cycle'
                      value={values.repeat_cycle}
                      label='Repeat Cycle'
                      onChange={handleValues}>
                      <MenuItem value={''}>
                        <em>None</em>
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
              Add Event
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => navigate(-1)}>
                Go back
              </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default AddEvent;
