import { useState, useEffect } from 'react';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AnimatedPage from '../../components/AnimatedPage';
import { toast } from 'react-toastify';

const EditCategory = () => {
  const { state } = useLocation();
  // console.log('STATE', state);
  // const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    id: '',
    category: '',
    description: '',
    buttonText: 'Update Category',
  });

  const handleValue = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  console.log('VALUES', values);
  const id = state._id;
  const { category, description } = state;

  useEffect(() => {
    setValues(prev => ({ ...prev, id, category, description }));
  }, [id, navigate, category, description]);

  const handleSubmit = async event => {
    event.preventDefault();
    // console.table(values);
    setValues({ ...values, buttonText: '...Updating Category' });

    try {
      const {
        data: { message },
      } = await instance.put(`/category/update/${id}`, {
        category: values.category,
        description: values.description,
      });
      console.log('CATEGORY UPDATED', message);
      setValues({ ...values, buttonText: 'Updated Category' });
      // toast.success('Successfully updated');
      navigate('/categories');
    } catch (err) {
      console.log('CATEGORY UPDATE ERROR', err.response.data);
      setValues({ ...values, buttonText: 'Update Category' });
      toast.error(err.response.data.error);
    }
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
          <h1>Edit Category</h1>

          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  value={values.category}
                  id='category'
                  label='New Category'
                  name='category'
                  size='small'
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
                  name='description'
                  label='Description'
                  id='description'
                  size='small'
                  onChange={handleValue}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}>
                  {values.buttonText}
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => navigate(-1)}>
                  Go back
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EditCategory;
