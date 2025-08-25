// src/pages/crud/AddCategory.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Button, TextField, Fade } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage';
import Pumpkin from '@/images/pumpkin.jpg';
import CucumberSlice from '@/images/cucumber_slice.jpg';
import { toast } from 'react-toastify';
import api from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function AddCategory() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuthContext();

  const [values, setValues] = useState({
    category: '',
    description: '',
    buttonText: 'Add Category',
  });

  const handleValues = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues((v) => ({ ...v, buttonText: '...Adding Category' }));
    try {
      const { data } = await api.post('/category/create', {
        category: values.category,
        description: values.description,
      });
      toast.success('Category created');
      // refresh categories list
      qc.invalidateQueries({ queryKey: ['categories', 'mine', user?._id], exact: false });
      navigate('/categories');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Create failed');
      setValues((v) => ({ ...v, buttonText: 'Add Category' }));
    }
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
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
          <h1>Add Category</h1>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Pumpkin}
                />
              </Fade>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1, width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={values.category}
                  id="category"
                  label="New Category"
                  name="category"
                  size="small"
                  onChange={handleValues}
                  autoFocus
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={1}
                  value={values.description}
                  name="description"
                  label="Description"
                  id="description"
                  size="small"
                  onChange={handleValues}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  {values.buttonText}
                </Button>
                <Grid container>
                  <Grid item xs />
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={CucumberSlice}
                />
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
}
