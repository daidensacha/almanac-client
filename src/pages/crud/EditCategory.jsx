// src/pages/crud/EditCategory.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Grid, Button, TextField } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage';
import { toast } from 'react-toastify';
import api from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function EditCategory() {
  const { state } = useLocation(); // category object
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuthContext();

  const [values, setValues] = useState({
    id: '',
    category: '',
    description: '',
    buttonText: 'Update Category',
  });

  useEffect(() => {
    if (!state) return;
    setValues((v) => ({
      ...v,
      id: state._id,
      category: state.category || '',
      description: state.description || '',
    }));
  }, [state]);

  const handleValue = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues((v) => ({ ...v, buttonText: '...Updating Category' }));
    try {
      await api.put(`/category/update/${values.id}`, {
        category: values.category,
        description: values.description,
      });
      toast.success('Category updated');
      // refresh categories list
      qc.invalidateQueries({ queryKey: ['categories', 'mine', user?._id], exact: false });
      navigate('/categories');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Update failed');
      setValues((v) => ({ ...v, buttonText: 'Update Category' }));
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
          <h1>Edit Category</h1>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={values.category}
                  id="category"
                  label="New Category"
                  name="category"
                  size="small"
                  onChange={handleValue}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
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
                  onChange={handleValue}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  {values.buttonText}
                </Button>
              </Grid>
            </Grid>

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
