import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import AnimatedPage from '@/components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toDateOrNull, toIsoDateStringOrNull } from '@utils/dateHelpers'; // import to fix date issue
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import instance from '@/utils/axiosClient';
import { useEventsContext } from '@/contexts/EventsContext';
import { usePlantsContext } from '@/contexts/PlantsContext';
import { useCategoriesContext } from '@/contexts/CategoriesContext';

const EditEvent = () => {
  const { state } = useLocation();
  // const { id } = useParams();
  const navigate = useNavigate();

  const { events, setEvents } = useEventsContext();
  const { plants } = usePlantsContext();
  const { categories } = useCategoriesContext();

  const [values, setValues] = useState(state);

  // console.log('VALUES', values);
  // useEffect(() => {
  //   setValues({ ...state });
  // }, [state]);

  // const [values, setValues] = useState({
  //   event_name: '',
  //   description: '',
  //   category_id: '',
  //   plant_id: '',
  //   occurs_at: null,
  //   occurs_to: null,
  //   repeat_cycle: '',
  //   repeat_frequency: 0,
  //   notes: '',
  // });

  // Handle form values and set to state
  const handleValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(event.target.name, event.target.value);
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      category_id: state.category._id,
      plant_id: state.plant._id,
    }));
  }, [state.category._id, state.plant._id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values });
    // console.log('SUBMIT VALUES', values);
    try {
      const {
        data: { updatedEvent },
      } = await instance.put(`/event/update/${values._id}`, {
        event_name: values.event_name,
        description: values.description,
        occurs_at: toIsoDateStringOrNull(values.occurs_at),
        occurs_to: toIsoDateStringOrNull(values.occurs_to),
        repeat_cycle: values.repeat_cycle,
        repeat_frequency: values.repeat_frequency,
        notes: values.notes,
        category: values.category_id,
        plant: values.plant_id,
      });
      // console.log('SUCCESS', updatedEvent);
      setValues({ ...values });
      //spread state, exclude current category, add updated category
      setEvents((prev) => [...prev.filter((event) => event._id !== state._id), updatedEvent]);
      console.log('Update event', events);
      toast.success(`Event "${updatedEvent.event_name}" updated successfully`);
      navigate('/events');
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error);
    }
  };

  // console.log('Updated events', events)
  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1>Edit Event Page</h1>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="event_name"
                    value={values.event_name}
                    name="event_name"
                    required
                    helperText="Required"
                    fullWidth
                    id="event_name"
                    label="Event Name"
                    size="small"
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={values.description}
                    id="description"
                    label="Description"
                    name="description"
                    autoComplete="description"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="category_id">Category</InputLabel>
                    <Select
                      labelId="category_id"
                      id="category_id"
                      name="category_id"
                      value={values?.category_id || ''}
                      label="Category"
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
                  <FormControl required fullWidth sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="plant_id">Plant</InputLabel>
                    <Select
                      labelId="plant_id"
                      id="plant_id"
                      name="plant_id"
                      value={values?.plant_id || ''}
                      label="Plant"
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
                    label="Occurs at"
                    value={toDateOrNull(values.occurs_at)}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setValues({ ...values, occurs_at: newValue });
                    }}
                    slotProps={{
                      textField: {
                        name: 'occurs_at',
                        id: 'occurs_at',
                        size: 'small',
                        required: true,
                        helperText: 'Required',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Occurs to"
                    value={toDateOrNull(values.occurs_to)}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setValues({ ...values, occurs_to: newValue });
                    }}
                    slotProps={{
                      textField: {
                        name: 'occurs_to',
                        id: 'occurs_to',
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    value={values.repeat_frequency}
                    name="repeat_frequency"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 26 } }}
                    fullWidth
                    id="repeat_frequency"
                    label="Repeats Every"
                    size="small"
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{}} size="small">
                    <InputLabel id="repeat_cycle">Repeat Cycle</InputLabel>
                    <Select
                      labelId="repeat_cycle"
                      id="repeat_cycle"
                      name="repeat_cycle"
                      value={values.repeat_cycle}
                      label="Unit of time"
                      onChange={handleValues}
                    >
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
                    fullWidth
                    multiline
                    rows={4}
                    value={values.notes}
                    name="notes"
                    label="Notes"
                    id="notes"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Event
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIos fontSize="small" />
                  Back
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EditEvent;
