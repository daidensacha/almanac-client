import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddEvent = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    event_name: '',
    description: '',
    occurs_at: null,
    month: '',
    repeats_inc: '',
    repeats_time: '',
    notes: '',
    // buttonText: 'Sign Up',
  });

  // const [selectedDate, handleDateChange] = useState(new Date());

  console.log('VALUES', values);
  // console.log('SELECTED DATE', selectedDate);

  const {
    event_name,
    description,
    occurs_at,
    month,
    repeats_inc,
    repeats_time,
    notes,
    // buttonText,
  } = values;

  // Handle form values and set to state
  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setValues({ ...values });
    console.log('SUBMIT VALUES', values);
    // axios({
    //   method: 'POST',
    //   url: `${process.env.REACT_APP_API}/signup`,
    //   data: {
    //     common_name,
    //     botanical_name,
    //     sow_at,
    //     plant_at,
    //     harvest_at,
    //     harvest_to,
    //     fertiliser,
    //     fertiliser_type,
    //     spacing,
    //     depth,
    //     notes,
    //   },
    // })
    //   .then(response => {
    //     console.log('SIGNUP SUCCESS', response);
    //     setValues({
    //       ...values,
    //       common_name: '',
    //       botanical_name: '',
    //       sow_at: '',
    //       plant_at: '',
    //       harvest_at: '',
    //       harvest_to: '',
    //       fertiliser: '',
    //       fertiliser_type: '',
    //       spacing: '',
    //       depth: '',
    //       notes: '',
    //     });
    //     toast.success(response.data.message);
    //   })
    //   .catch(error => {
    //     console.log('SIGNUP ERROR', error.response.data);
    //     setValues({ ...values, buttonText: 'Sign Up' });
    //     toast.error(error.response.data.error);
    //   });
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
          {/* Start form */}

          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}>
            <LocalizationProvider
              utils={MomentUtils}
              dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <TextField
                    autoComplete='event_name'
                    value={values.event_name}
                    name='event_name'
                    required
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
                      <TextField size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="month">Month</InputLabel>
                  <Select
                    labelId="month"
                    id="month"
                    name="month"
                    value={values.month}
                    label="Month"
                    onChange={handleValues}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'January'}>January</MenuItem>
                    <MenuItem value={'Febuary'}>Febuary</MenuItem>
                    <MenuItem value={'March'}>March</MenuItem>
                    <MenuItem value={'April'}>April</MenuItem>
                    <MenuItem value={'May'}>May</MenuItem>
                    <MenuItem value={'June'}>June</MenuItem>
                    <MenuItem value={'July'}>July</MenuItem>
                    <MenuItem value={'August'}>August</MenuItem>
                    <MenuItem value={'September'}>September</MenuItem>
                    <MenuItem value={'October'}>October</MenuItem>
                    <MenuItem value={'November'}>November</MenuItem>
                    <MenuItem value={'December'}>December</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    defaultValue={0}
                    value={values.repeats_inc}
                    name='repeats_inc'
                    type='number'
                    InputProps={{ inputProps: { min: 0, max: 52 } }}
                    fullWidth
                    id='repeats_inc'
                    label='Every'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{  }} size="small">
                  <InputLabel id="repeats_time">Unit of time</InputLabel>
                  <Select
                    labelId="repeats_time"
                    id="repeats_time"
                    name="repeats_time"
                    value={values.repeats_time}
                    label="Unit of time"
                    onChange={handleValues}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Hours'}>Hours</MenuItem>
                    <MenuItem value={'Days'}>Days</MenuItem>
                    <MenuItem value={'March'}>Weeks</MenuItem>
                    <MenuItem value={'Months'}>Months</MenuItem>
                    <MenuItem value={'Years'}>Years</MenuItem>
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
                <Link component={RouterLink} sx={{ color: 'secondary.main'}} to='/events' variant='body2'>
                  Back to events
                </Link>
              </Grid>
            </Grid>
          </Box>

          {/* End form */}
        </Box>
      </Container>
    </AnimatedPage>
  )
}

export default AddEvent;