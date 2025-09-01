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
  FormControlLabel,
  Switch,
} from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';

import api from '@/utils/axiosClient';
import { useCategories } from '@/queries/useCategories';
import { usePlants } from '@/queries/usePlants';
import { useQueryClient } from '@tanstack/react-query';
import { keys as eventKeys } from '@/queries/useEvents';
import { toDateOrNull } from '@/utils/dateHelpers';
import { serializeEvent } from '@/utils/normalizers';

export default function EditEvent() {
  const { state } = useLocation(); // expected: full event object
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Load select options (non-archived)
  const catsQ = useCategories(false, { retry: false });
  const plantsQ = usePlants(false, { retry: false });
  const categories = catsQ.data || [];
  const plants = plantsQ.data || [];

  const normalizeId = (val) => {
    if (!val) return '';
    if (typeof val === 'object') return String(val._id || '');
    return String(val);
  };

  const [values, setValues] = useState(() => ({
    _id: state?._id || '',
    event_name: state?.event_name || '',
    description: state?.description || '',
    occurs_at: toDateOrNull(state?.occurs_at),
    occurs_to: toDateOrNull(state?.occurs_to),
    repeat_cycle: state?.repeat_cycle || '',
    repeat_frequency: state?.repeat_frequency ?? '',
    repeat_yearly: !!state?.repeat_yearly, // NEW
    notes: state?.notes || '',
    category_id: normalizeId(state?.category_id ?? state?.category),
    plant_id: normalizeId(state?.plant_id ?? state?.plant),
  }));

  useEffect(() => {
    if (!state) return;
    setValues((v) => ({
      ...v,
      _id: state?._id || '',
      event_name: state?.event_name || '',
      description: state?.description || '',
      occurs_at: toDateOrNull(state?.occurs_at),
      occurs_to: toDateOrNull(state?.occurs_to),
      repeat_cycle: state?.repeat_cycle || '',
      repeat_frequency: state?.repeat_frequency ?? '',
      repeat_yearly: !!state?.repeat_yearly, // NEW
      notes: state?.notes || '',
      category_id: normalizeId(state?.category_id ?? state?.category),
      plant_id: normalizeId(state?.plant_id ?? state?.plant),
    }));
  }, [state]);

  // Prevent MUI "out-of-range" on initial render
  const catIds = useMemo(() => new Set(categories.map((c) => String(c._id))), [categories]);
  const plantIds = useMemo(() => new Set(plants.map((p) => String(p._id))), [plants]);
  const safeCategoryId = catIds.has(values.category_id) ? values.category_id : '';
  const safePlantId = plantIds.has(values.plant_id) ? values.plant_id : '';

  // Loading / error for options (keeps the form clean)
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

  // const onChange = (e) => {
  //   const { name, value } = e.target;
  //   setValues((v) => ({ ...v, [name]: value }));
  // };
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const smartBack = () => {
    if (state?.from) {
      return navigate(state.from, { replace: true });
    }
    // fallback: back in history (works from both Calendar and Events)
    return navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.event_name?.trim()) return toast.error('Event name is required');
    if (!values.occurs_at) return toast.error('Occurs at is required');
    if (!safeCategoryId) return toast.error('Category is required');
    if (!safePlantId) return toast.error('Plant is required');

    try {
      const payload = serializeEvent(values);

      const { data } = await api.put(`/event/update/${values._id}`, payload);
      toast.success(`Event "${data?.event_name || values.event_name}" updated`);

      // Refresh event lists/detail
      qc.invalidateQueries({ queryKey: eventKeys.all, exact: false });

      // navigate('/events');
      navigate(-1);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.error || 'Update failed');
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    label="Event Name"
                    size="small"
                    onChange={onChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={values.description || ''}
                    name="description"
                    label="Description"
                    size="small"
                    onChange={onChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth size="small">
                    <InputLabel id="category_id">Category</InputLabel>

                    <Select
                      name="category_id"
                      value={values.category_id}
                      label="Category"
                      // onChange={handleValues}
                      onChange={onChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c._id} value={String(c._id)}>
                          {c.category_name}
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
                      name="plant_id"
                      value={values.plant_id}
                      label="Plant"
                      // onChange={handleValues}
                      onChange={onChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {plants.map((p) => (
                        <MenuItem key={p._id} value={String(p._id)}>
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
                    onChange={onChange}
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
                      onChange={onChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Week">Week</MenuItem>
                      <MenuItem value="Month">Month</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="repeat_yearly"
                        checked={!!values.repeat_yearly}
                        onChange={onChange}
                        color="secondary"
                      />
                    }
                    label="Repeat yearly"
                  />
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
                    onChange={onChange}
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
