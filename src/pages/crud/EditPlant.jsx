// src/pages/crud/EditPlant.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage';
import { toast } from 'react-toastify';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { toDateOrNull, toIsoDateStringOrNull } from '@/utils/dateHelpers';
import instance from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function EditPlant() {
  const { state } = useLocation(); // assume you navigate with { state: plant }
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const qc = useQueryClient();

  // Form state (init from router state)
  const [values, setValues] = useState(() => ({
    _id: state?._id || '',
    common_name: state?.common_name || '',
    botanical_name: state?.botanical_name || '',
    sow_at: toDateOrNull(state?.sow_at),
    plant_at: toDateOrNull(state?.plant_at),
    harvest_at: toDateOrNull(state?.harvest_at),
    harvest_to: toDateOrNull(state?.harvest_to),
    fertilise: state?.fertilise || '',
    fertiliser_type: state?.fertiliser_type || '',
    spacing: state?.spacing || '',
    depth: state?.depth || '',
    notes: state?.notes || '',
  }));

  // If the page can be refreshed and state rehydrates later, keep in sync
  useEffect(() => {
    if (!state) return;
    setValues((prev) => ({
      ...prev,
      _id: state._id,
      common_name: state.common_name || '',
      botanical_name: state.botanical_name || '',
      sow_at: toDateOrNull(state.sow_at),
      plant_at: toDateOrNull(state.plant_at),
      harvest_at: toDateOrNull(state.harvest_at),
      harvest_to: toDateOrNull(state.harvest_to),
      fertilise: state.fertilise || '',
      fertiliser_type: state.fertiliser_type || '',
      spacing: state.spacing || '',
      depth: state.depth || '',
      notes: state.notes || '',
    }));
  }, [state]);

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
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
      };

      const {
        data: { updatedPlant },
      } = await instance.put(`/plant/update/${values._id}`, payload);

      toast.success(`Plant "${updatedPlant?.common_name || ''}" updated`);

      // refresh lists that depend on plants for this user
      qc.invalidateQueries({ queryKey: ['plants', 'mine', user?._id] });
      navigate('/plants');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Update failed';
      console.error('PLANT EDIT ERROR', err?.response?.data || err);
      toast.error(msg);
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
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Sow at"
                    value={values.sow_at}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, sow_at: d }))}
                    slotProps={{
                      textField: { name: 'sow_at', id: 'sow_at', size: 'small', fullWidth: true },
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
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Plant at"
                    value={values.plant_at}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, plant_at: d }))}
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
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Harvest at"
                    value={values.harvest_at}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, harvest_at: d }))}
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
                    value={values.harvest_to}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, harvest_to: d }))}
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
                    size="small"
                    onChange={handleValues}
                  />
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
}
