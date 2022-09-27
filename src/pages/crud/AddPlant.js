import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
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


const AddPlant = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    common_name: '',
    botanical_name: '',
    sow_at: null,
    plant_at: null,
    harvest_at: null,
    harvest_to: null,
    fertilise: '',
    fertiliser_type: '',
    spacing: '',
    depth: '',
    notes: '',
    // buttonText: 'Sign Up',
  });

  // const [selectedDate, handleDateChange] = useState(new Date());

  console.log('VALUES', values);
  // console.log('SELECTED DATE', selectedDate);

  // const {
  //   common_name,
  //   botanical_name,
  //   sow_at,
  //   plant_at,
  //   harvest_at,
  //   harvest_to,
  //   fertilise,
  //   fertiliser_type,
  //   spacing,
  //   depth,
  //   notes,
  // } = values;

  // Handle form values and set to state
  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setValues({ ...values });
    console.log('SUBMIT VALUES', values);

    const createPlant = async () => {
      try {
        const { newPlant } = await instance.post(
          `${process.env.REACT_APP_API}/plant/create`,
          {
            common_name: values.common_name,
            botanical_name: values.botanical_name,
            sow_at: values.sow_at,
            plant_at: values.plant_at,
            harvest_at: values.harvest_at,
            harvest_to: values.harvest_to,
            fertilise: values.fertilise,
            fertiliser_type: values.fertiliser_type,
            spacing: values.spacing,
            depth: values.depth,
            notes: values.notes,
          },
        );
        console.log('PLANT CREATED', newPlant);
        toast.success('Plant created');
        navigate('/plants');
      } catch (error) {
        console.log('PLANT CREATE ERROR', error.response.data);
        toast.error(error.response.data.error);
      }
    };

    createPlant();
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
          <h1>Add Plant</h1>
          {/* Start form elements */}

          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}>
            <LocalizationProvider
              utils={MomentUtils}
              dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete='given-name'
                    value={values.common_name}
                    name='common_name'
                    required
                    fullWidth
                    id='common_name'
                    label='Common Name'
                    size='small'
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.botanical_name}
                    id='botanical_name'
                    label='Botanical Name'
                    name='botanical_name'
                    autoComplete='botanical_name'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label='Sow at'
                    name='sow_at'
                    id='sow_at'
                    value={values.sow_at}
                    inputFormat='dd/MM/yyyy'
                    onChange={newValue => {
                      setValues({ ...values, sow_at: newValue });
                    }}
                    renderInput={params => (
                      <TextField size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.depth}
                    id='depth'
                    label='Sowing Depth'
                    name='depth'
                    autoComplete='depth'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label='Plant at'
                    name='plant_at'
                    id='plant_at'
                    value={values.plant_at}
                    // color='secondary'
                    // disableFuture
                    // openTo='year'
                    // views={['year', 'month', 'day']}
                    inputFormat='dd/MM/yyyy'
                    onChange={newValue => {
                      setValues({ ...values, plant_at: newValue });
                    }}
                    renderInput={params => (
                      <TextField size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    value={values.spacing}
                    name='spacing'
                    fullWidth
                    id='spacing'
                    label='Plant Spacing'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label='Harvest at'
                    name='harvest_at'
                    id='harvest_at'
                    value={values.harvest_at}
                    inputFormat='dd/MM/yyyy'
                    onChange={newValue => {
                      setValues({ ...values, harvest_at: newValue });
                    }}
                    renderInput={params => (
                      <TextField size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label='Harvest to'
                    name='harvest_to'
                    id='harvest_to'
                    value={values.harvest_to}
                    inputFormat='dd/MM/yyyy'
                    onChange={newValue => {
                      setValues({ ...values, harvest_to: newValue });
                    }}
                    renderInput={params => (
                      <TextField size='small' {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.fertilise}
                    name='fertilise'
                    id='fertilise'
                    label='Fertilise'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.fertiliser_type}
                    id='fertiliser_type'
                    label='Fertiliser type'
                    name='fertiliser_type'
                    autoComplete='fertiliser_type'
                    size='small'
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
              Add Plant
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link
                  component={RouterLink}
                  sx={{ color: 'secondary.main' }}
                  to='/plants'
                  variant='body2'>
                  Back to plants
                </Link>
              </Grid>
            </Grid>
          </Box>
          {/* End form elements */}
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default AddPlant;
