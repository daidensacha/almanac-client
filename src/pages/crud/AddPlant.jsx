// src/pages/crud/AddPlant.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '@/utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage'; //
import { toast } from 'react-toastify'; //
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; //
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; //
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; //
import { toDateOrNull, toIsoDateStringOrNull } from '@utils/dateHelpers';
import api from '@/utils/axiosClient';
import { useQueryClient } from '@tanstack/react-query';
import { serializePlant } from '@/utils/normalizers';
import { keys as plantKeys } from '@/queries/usePlants';

export default function AddPlant() {
  const navigate = useNavigate();
  const qc = useQueryClient();

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
    buttonText: 'Add Plant',
  });

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues((v) => ({ ...v, buttonText: '...Adding Plant' }));

    try {
      const payload = serializePlant(values); // keeps empty strings if you typed them
      const { data } = await api.post('/plant/create', payload);
      // console.log('[CreatePlant] created:', data);
      toast.success(`Plant "${data?.common_name || payload.common_name}" created`);

      // refresh plants lists
      qc.invalidateQueries({ queryKey: plantKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: plantKeys.list(false), exact: false });

      navigate('/plants');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Create failed');
    } finally {
      setValues((v) => ({ ...v, buttonText: 'Add Plant' }));
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, mb: 4, minHeight: 'calc(100vh - 375px)' }}>
          <h1>Add Plant</h1>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    autoFocus
                    id="common_name"
                    name="common_name"
                    label="Common Name"
                    value={values.common_name}
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="botanical_name"
                    name="botanical_name"
                    label="Botanical Name"
                    value={values.botanical_name}
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Sow at"
                    value={toDateOrNull(values.sow_at)}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, sow_at: d }))}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="depth"
                    name="depth"
                    label="Sowing Depth"
                    value={values.depth}
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Plant at"
                    value={toDateOrNull(values.plant_at)}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, plant_at: d }))}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="spacing"
                    name="spacing"
                    label="Plant Spacing"
                    value={values.spacing}
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Harvest at"
                    value={toDateOrNull(values.harvest_at)}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, harvest_at: d }))}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Harvest to"
                    value={toDateOrNull(values.harvest_to)}
                    format="dd/MM/yyyy"
                    onChange={(d) => setValues((v) => ({ ...v, harvest_to: d }))}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="fertilise"
                    name="fertilise"
                    label="Fertilise"
                    value={values.fertilise}
                    onChange={handleValues}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="fertiliser_type"
                    name="fertiliser_type"
                    label="Fertiliser type"
                    value={values.fertiliser_type}
                    onChange={handleValues}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={4}
                    id="notes"
                    name="notes"
                    label="Notes"
                    value={values.notes}
                    onChange={handleValues}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Add Plant
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIos fontSize="small" /> Back
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
}

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '@/utils/axiosClient';
// import { useQueryClient } from '@tanstack/react-query';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
// import { toast } from 'react-toastify';
// import AnimatedPage from '@/components/AnimatedPage';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { toDateOrNull, toIsoDateStringOrNull } from '@utils/dateHelpers'; // import to fix date issue

// const AddPlant = () => {
//   const navigate = useNavigate();

//   const queryClient = useQueryClient();

//   const [values, setValues] = useState({
//     common_name: '',
//     botanical_name: '',
//     sow_at: null,
//     plant_at: null,
//     harvest_at: null,
//     harvest_to: null,
//     fertilise: '',
//     fertiliser_type: '',
//     spacing: '',
//     depth: '',
//     notes: '',
//   });

//   // Handle form values and set to state
//   const handleValues = (event) => {
//     setValues({ ...values, [event.target.name]: event.target.value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setValues({ ...values });
//     // console.log('SUBMIT VALUES', values);

//     const createPlant = async () => {
//       try {
//         await api.post(`/plant/create`, {
//           common_name: values.common_name,
//           botanical_name: values.botanical_name,
//           sow_at: toIsoDateStringOrNull(values.sow_at),
//           plant_at: toIsoDateStringOrNull(values.plant_at),
//           harvest_at: toIsoDateStringOrNull(values.harvest_at),
//           harvest_to: toIsoDateStringOrNull(values.harvest_to),
//           fertilise: values.fertilise,
//           fertiliser_type: values.fertiliser_type,
//           spacing: values.spacing,
//           depth: values.depth,
//           notes: values.notes,
//         });

//         toast.success('Plant created');
//         // Make any plants list re-fetch (e.g. queryKey ['plants'] or ['plants:mine'])
//         queryClient.invalidateQueries({ queryKey: ['plants'] });
//         queryClient.invalidateQueries({ queryKey: ['plants:mine'] });
//         navigate('/plants');
//       } catch (error) {
//         console.log('PLANT CREATE ERROR', error.response.data.error);
//         toast.error(error.response.data.error);
//       }
//     };

//     createPlant();
//   };

//   return (
//     <AnimatedPage>
//       <Container component="main" maxWidth="xs">
//         <Box
//           sx={{
//             marginTop: 8,
//             marginBottom: 4,
//             minHeight: 'calc(100vh - 375px)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <h1>Add Plant</h1>

//           <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     autoComplete="given-name"
//                     value={values.common_name}
//                     name="common_name"
//                     required
//                     fullWidth
//                     id="common_name"
//                     label="Common Name"
//                     size="small"
//                     autoFocus
//                     onChange={handleValues}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     value={values.botanical_name}
//                     id="botanical_name"
//                     label="Botanical Name"
//                     name="botanical_name"
//                     autoComplete="botanical_name"
//                     size="small"
//                     onChange={handleValues}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <DatePicker
//                     label="Sow at"
//                     value={toDateOrNull(values.sow_at)}
//                     format="dd/MM/yyyy"
//                     onChange={(newValue) => {
//                       setValues({ ...values, sow_at: newValue });
//                     }}
//                     slotProps={{
//                       textField: {
//                         name: 'sow_at',
//                         id: 'sow_at',
//                         size: 'small',
//                         fullWidth: true,
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     value={values.depth}
//                     id="depth"
//                     label="Sowing Depth"
//                     name="depth"
//                     autoComplete="depth"
//                     size="small"
//                     onChange={handleValues}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <DatePicker
//                     label="Plant at"
//                     value={toDateOrNull(values.plant_at)}
//                     format="dd/MM/yyyy"
//                     onChange={(newValue) => {
//                       setValues({ ...values, plant_at: newValue });
//                     }}
//                     slotProps={{
//                       textField: {
//                         name: 'plant_at',
//                         id: 'plant_at',
//                         size: 'small',
//                         fullWidth: true,
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     value={values.spacing}
//                     name="spacing"
//                     fullWidth
//                     id="spacing"
//                     label="Plant Spacing"
//                     size="small"
//                     onChange={handleValues}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <DatePicker
//                     label="Harvest at"
//                     value={toDateOrNull(values.harvest_at)}
//                     format="dd/MM/yyyy"
//                     onChange={(newValue) => {
//                       setValues({ ...values, harvest_at: newValue });
//                     }}
//                     slotProps={{
//                       textField: {
//                         name: 'harvest_at',
//                         id: 'harvest_at',
//                         size: 'small',
//                         fullWidth: true,
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <DatePicker
//                     label="Harvest to"
//                     value={toDateOrNull(values.harvest_to)}
//                     format="dd/MM/yyyy"
//                     onChange={(newValue) => {
//                       setValues({ ...values, harvest_to: newValue });
//                     }}
//                     slotProps={{
//                       textField: {
//                         name: 'harvest_to',
//                         id: 'harvest_to',
//                         size: 'small',
//                         fullWidth: true,
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     value={values.fertilise}
//                     name="fertilise"
//                     id="fertilise"
//                     label="Fertilise"
//                     size="small"
//                     onChange={handleValues}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     value={values.fertiliser_type}
//                     id="fertiliser_type"
//                     label="Fertiliser type"
//                     name="fertiliser_type"
//                     autoComplete="fertiliser_type"
//                     size="small"
//                     onChange={handleValues}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={4}
//                     value={values.notes}
//                     name="notes"
//                     label="Notes"
//                     id="notes"
//                     size="small"
//                     onChange={handleValues}
//                   />
//                 </Grid>
//               </Grid>
//             </LocalizationProvider>
//             <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//               Add Plant
//             </Button>
//             <Grid container justifyContent="flex-end">
//               <Grid item>
//                 <Button
//                   color="secondary"
//                   variant="outlined"
//                   size="small"
//                   onClick={() => navigate(-1)}
//                 >
//                   <ArrowBackIos fontSize="small" />
//                   Back
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </AnimatedPage>
//   );
// };

// export default AddPlant;
