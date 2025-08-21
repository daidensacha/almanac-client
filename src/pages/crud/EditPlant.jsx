import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import AnimatedPage from '@/components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toDateOrNull, toIsoDateStringOrNull } from '@utils/dateHelpers'; // import to fix date issue
import instance from '@/utils/axiosClient';
import { usePlantsContext } from '@/contexts/PlantsContext';

const EditPlant = () => {
  const { state } = useLocation();
  // const { id } = useParams();
  // console.log('ID', id);
  // console.log('STATE', state);
  const navigate = useNavigate();

  const { setPlants } = usePlantsContext();

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
    created_at: '',
    // buttonText: 'Sign Up',
  });

  useEffect(() => {
    setValues({ ...state });
  }, [state]);

  // console.log('VALUES', values);

  // Handle form values and set to state
  const handleValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values });
    // console.log('SUBMIT VALUES', values);
    try {
      const {
        data: { updatedPlant },
      } = await instance.put(`/plant/update/${state._id}`, {
        common_name: values.common_name,
        botanical_name: values.botanical_name,
        sow_at: toIsoDateStringOrNull(values.sow_at),
        plant_at: toIsoDateStringOrNull(values.plant_at),
        harvest_at: toIsoDateStringOrNull(values.harvest_at),
        harvest_to: toIsoDateStringOrNull(values.harvest_to),
        fertilise: values.fertilise,
        fertiliser_type: values.fertiliser_type,
        spacing: values.spacing,
        depth: values.depth,
        notes: values.notes,
      });
      console.log('PLANT UPDATED', updatedPlant);
      //spread state, exclude current plant, add updated plant
      setPlants((prev) => [...prev.filter((plant) => plant._id !== state._id), updatedPlant]);
      toast.success('Plant updated');
      navigate('/plants');
    } catch (error) {
      // console.log(error);
      console.log('PLANT EDIT ERROR', error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

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
          <h1>Edit Plant</h1>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    value={values.common_name}
                    name="common_name"
                    required
                    fullWidth
                    id="common_name"
                    label="Common Name"
                    size="small"
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.botanical_name}
                    id="botanical_name"
                    label="Botanical Name"
                    name="botanical_name"
                    autoComplete="botanical_name"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Sow at"
                    value={toDateOrNull(values.sow_at)}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setValues({ ...values, sow_at: newValue });
                    }}
                    slotProps={{
                      textField: {
                        name: 'sow_at',
                        id: 'sow_at',
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.depth}
                    id="depth"
                    label="Sowing Depth"
                    name="depth"
                    autoComplete="depth"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Plant at"
                    value={toDateOrNull(values.plant_at)}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setValues({ ...values, plant_at: newValue });
                    }}
                    slotProps={{
                      textField: {
                        name: 'plant_at',
                        id: 'plant_at',
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    value={values.spacing}
                    name="spacing"
                    fullWidth
                    id="spacing"
                    label="Plant Spacing"
                    size="small"
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Harvest at"
                    value={toDateOrNull(values.harvest_at)}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setValues({ ...values, harvest_at: newValue });
                    }}
                    slotProps={{
                      textField: {
                        name: 'harvest_at',
                        id: 'harvest_at',
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Harvest to"
                    value={toDateOrNull(values.harvest_to)}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setValues({ ...values, harvest_to: newValue });
                    }}
                    slotProps={{
                      textField: {
                        name: 'harvest_to',
                        id: 'harvest_to',
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.fertilise}
                    name="fertilise"
                    id="fertilise"
                    label="Fertilise"
                    size="small"
                    autoFocus
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={values.fertiliser_type}
                    id="fertiliser_type"
                    label="Fertiliser type"
                    name="fertiliser_type"
                    autoComplete="fertiliser_type"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
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
              Update Plant
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

export default EditPlant;
