import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import instance from '@/utils/axiosClient';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '@/components/AnimatedPage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
// import { getCookie } from '@/utils/helpers';
import { Fade } from '@mui/material';
import Pumpkin from '@/images/pumpkin.jpg';
import CucumberSlice from '@/images/cucumber_slice.jpg';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
// import { useAuthContext } from '@/contexts/AuthContext';

const AddCategory = () => {
  const navigate = useNavigate();

  const { setCategories } = useCategoriesContext();

  const [values, setValues] = useState({
    category: '',
    description: '',
    buttonText: 'Add Category',
  });

  const handleValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // console.log(values);

  // const token = getCookie('token');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.table(values);
    setValues({ ...values, buttonText: '...Adding Category' });

    const addCategory = async () => {
      const { category, description } = values;
      try {
        const {
          data: { newCategory },
        } = await instance.post('/category/create', {
          category,
          description,
        });
        console.log('CATEGORY ADDED', newCategory);
        setCategories((prev) => [...prev, newCategory]);
        setValues({
          ...values,
          category: '',
          description: '',
          buttonText: 'Added Category',
        });
        toast.success('Category created');
        navigate('/categories');
      } catch (error) {
        console.log('CATEGORY ADD ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Add Category' });
        toast.error(error.response.data.error);
      }
    };
    addCategory();
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
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
          <h1>Add Category</h1>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Fade in={true} timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Pumpkin}
                ></Box>
              </Fade>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                  <Grid item xs></Grid>
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <Fade in={true} timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={CucumberSlice}
                ></Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default AddCategory;
