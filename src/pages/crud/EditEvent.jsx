// src/pages/crud/EditEvent.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';

import instance from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCategories } from '@/queries/useCategories';
import { usePlants } from '@/queries/usePlants';
import { toDateOrNull, toIsoDateStringOrNull } from '@/utils/dateHelpers';
import { useQueryClient } from '@tanstack/react-query';

export default function EditEvent() {
  const { state } = useLocation(); // we navigate here with the full event in `state`
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuthContext();

  // Load select options
  const catsQ = useCategories(user?._id);
  const plantsQ = usePlants(user?._id);
  const categories = catsQ.data || [];
  const plants = plantsQ.data || [];

  // Local form state (normalize dates & select ids)
  const [values, setValues] = useState(() => ({
    ...state,
    event_name: state?.event_name || '',
    description: state?.description || '',
    occurs_at: toDateOrNull(state?.occurs_at),
    occurs_to: toDateOrNull(state?.occurs_to),
    repeat_cycle: state?.repeat_cycle || '',
    repeat_frequency: state?.repeat_frequency || '',
    notes: state?.notes || '',
    category_id: state?.category?._id ?? state?.category_id ?? '',
    plant_id: state?.plant?._id ?? state?.plant_id ?? '',
  }));

  // keep in sync if user navigates here from a different row without unmount
  useEffect(() => {
    if (!state) return;
    setValues((prev) => ({
      ...prev,
      ...state,
      occurs_at: toDateOrNull(state?.occurs_at),
      occurs_to: toDateOrNull(state?.occurs_to),
      category_id: state?.category?._id ?? state?.category_id ?? '',
      plant_id: state?.plant?._id ?? state?.plant_id ?? '',
    }));
  }, [state]);

  // While options are loading show a tiny loader (prevents out-of-range warnings)
  if (catsQ.isLoading || plantsQ.isLoading) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xs">
          <Box sx={{ mt: 8 }}>Loading…</Box>
        </Container>
      </AnimatedPage>
    );
  }
  if (catsQ.error || plantsQ.error) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xs">
          <Box sx={{ mt: 8, color: 'error.main' }}>Failed to load options.</Box>
        </Container>
      </AnimatedPage>
    );
  }

  // Only allow select values that exist in options (prevents MUI “out-of-range”)
  const catIds = useMemo(() => new Set(categories.map((c) => c._id)), [categories]);
  const plantIds = useMemo(() => new Set(plants.map((p) => p._id)), [plants]);
  const safeCategoryId = catIds.has(values.category_id) ? values.category_id : '';
  const safePlantId = plantIds.has(values.plant_id) ? values.plant_id : '';

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const occursAtIso = toIsoDateStringOrNull(values.occurs_at);
    if (!values.event_name?.trim()) return toast.error('Event name is required');
    if (!occursAtIso) return toast.error('Occurs at is required');
    if (!safeCategoryId) return toast.error('Category is required');
    if (!safePlantId) return toast.error('Plant is required');

    try {
      const {
        data: { updatedEvent },
      } = await instance.put(`/event/update/${values._id}`, {
        event_name: values.event_name,
        description: values.description,
        occurs_at: occursAtIso,
        occurs_to: toIsoDateStringOrNull(values.occurs_to),
        repeat_cycle: values.repeat_cycle,
        repeat_frequency: values.repeat_frequency,
        notes: values.notes,
        category: safeCategoryId,
        plant: safePlantId,
      });

      // refresh lists that might show this event
      qc.invalidateQueries({ queryKey: ['events'], exact: false });
      qc.invalidateQueries({ queryKey: ['events', 'mine'], exact: false });

      toast.success(`Event "${updatedEvent.event_name}" updated successfully`);
      navigate('/events');
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.error || 'Update failed');
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
          <h1>Edit Event</h1>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
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
                    value={values.description || ''}
                    id="description"
                    label="Description"
                    name="description"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth size="small">
                    <InputLabel id="category_id">Category</InputLabel>
                    <Select
                      labelId="category_id"
                      id="category_id"
                      name="category_id"
                      value={safeCategoryId}
                      label="Category"
                      onChange={handleValues}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.category}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth size="small">
                    <InputLabel id="plant_id">Plant</InputLabel>
                    <Select
                      labelId="plant_id"
                      id="plant_id"
                      name="plant_id"
                      value={safePlantId}
                      label="Plant"
                      onChange={handleValues}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {plants.map((p) => (
                        <MenuItem key={p._id} value={p._id}>
                          {p.common_name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Occurs at"
                    value={values.occurs_at}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => setValues((v) => ({ ...v, occurs_at: newValue }))}
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
                    value={values.occurs_to}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => setValues((v) => ({ ...v, occurs_to: newValue }))}
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
                    value={values.repeat_frequency ?? ''}
                    name="repeat_frequency"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 26 } }}
                    fullWidth
                    id="repeat_frequency"
                    label="Repeats Every"
                    size="small"
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="repeat_cycle">Repeat Cycle</InputLabel>
                    <Select
                      labelId="repeat_cycle"
                      id="repeat_cycle"
                      name="repeat_cycle"
                      value={values.repeat_cycle || ''}
                      label="Unit of time"
                      onChange={handleValues}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Week">Week</MenuItem>
                      <MenuItem value="Month">Month</MenuItem>
                      <MenuItem value="Year">Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={values.notes || ''}
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
}
