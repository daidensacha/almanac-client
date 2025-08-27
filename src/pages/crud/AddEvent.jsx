// src/pages/crud/AddEvent.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import AnimatedPage from '@/components/AnimatedPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toDateOrNull, toIsoDateStringOrNull } from '@utils/dateHelpers';
import api from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCategories } from '@/queries/useCategories';
import { usePlants } from '@/queries/usePlants';
import { useQueryClient } from '@tanstack/react-query';
import { serializeEvent } from '@/utils/normalizers';
import { keys as eventKeys } from '@/queries/useEvents';

export default function AddEvent() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuthContext();

  // fetch lists (hooks are always called – no conditional returns before these)
  const catsQ = useCategories(user?._id);
  const plantsQ = usePlants(user?._id);
  const categories = catsQ.data || [];
  const plants = plantsQ.data || [];

  // local form state
  const [values, setValues] = useState({
    event_name: '',
    description: '',
    category_id: '',
    plant_id: '',
    occurs_at: null,
    occurs_to: null,
    repeat_cycle: '',
    repeat_frequency: '',
    notes: '',
  });

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  // It’s safe to early-return now because all hooks above have already run
  if (catsQ.isLoading || plantsQ.isLoading) return null;
  if (catsQ.error || plantsQ.error) return <div>Failed to load options</div>;

  // guard select values so MUI doesn’t warn about out-of-range values
  const catIds = new Set(categories.map((c) => String(c._id)));
  const plantIds = new Set(plants.map((p) => String(p._id)));
  const safeCategoryId =
    values.category_id && catIds.has(String(values.category_id)) ? String(values.category_id) : '';
  const safePlantId =
    values.plant_id && plantIds.has(String(values.plant_id)) ? String(values.plant_id) : '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const occursAtIso = toIsoDateStringOrNull(values.occurs_at);
    if (!values.event_name?.trim()) return toast.error('Event name is required');
    if (!occursAtIso) return toast.error('Occurs at is required');
    if (!safeCategoryId) return toast.error('Category is required');
    if (!safePlantId) return toast.error('Plant is required');

    try {
      // Option A: build payload explicitly (matches controller)
      const payload = serializeEvent({
        ...values,
        category_id: safeCategoryId,
        plant_id: safePlantId,
      });
      await api.post('/event/create', payload);

      // refresh events everywhere
      qc.invalidateQueries({ queryKey: eventKeys.all, exact: false });

      toast.success('Event created');
      navigate('/events');
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.error || 'Create failed');
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            mb: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1>Add Event</h1>
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
                    value={values.description}
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
                    value={toDateOrNull(values.occurs_at)}
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
                    value={toDateOrNull(values.occurs_to)}
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
                    value={values.repeat_frequency}
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
                      label="Repeat Cycle"
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
              Add Event
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
