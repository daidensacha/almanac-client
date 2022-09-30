import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import instance from '../../utils/axiosClient';
// import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '../../components/AnimatedPage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { getCookie } from '../../utils/helpers';

const AddCategory = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    category: '',
    description: '',
    buttonText: 'Add Category',
  });

  const handleValues = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  console.log(values);

  const token = getCookie('token');

  const handleSubmit = event => {
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
        setValues({
          ...values,
          category: '',
          description: '',
          buttonText: 'Added Category',
        });
        // toast.success(category.data.message);
        navigate('/categories');
      } catch (error) {
        console.log('CATEGORY ADD ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Add Category' });
        toast.error(error.response.data.error);
      }
    };
    addCategory();
  };

  //   axios({
  //     method: 'POST',
  //     url: `${process.env.REACT_APP_API}/category/create`,
  //     data: {
  //       category: values.category,
  //       description: values.description,
  //     },
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then(response => {
  //       console.log('CATEGORY CREATED', response);
  //       setValues({ ...values, buttonText: 'Added Category' });
  //       toast.success(`Successfully added ${values.category}`);
  //       navigate('/categories');
  //     })
  //     .catch(error => {
  //       console.log('CATEGORY CREATE ERROR', error.response.data);
  //       setValues({ ...values, buttonText: 'Add Category' });
  //       toast.error(error.response.data.error);
  //     });
  // };

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
          <h1>Add Category</h1>

          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              value={values.category}
              id='category'
              label='New Category'
              name='category'
              size='small'
              onChange={handleValues}
              autoFocus
            />
            {/* <Grid item xs={12}> */}
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
              onChange={handleValues}
            />
            {/* </Grid> */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              {values.buttonText}
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link component={RouterLink} to='/categories' variant='body2'>
                  {'Back to Categories'}
                </Link>
              </Grid>
            </Grid>
          </Box>

          {/* <Button
            color='primary'
            variant='outlined'
            size='small'
            onClick={() => navigate(-1)}>
            <ArrowBackIos fontSize='small' />
            Back
          </Button> */}
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default AddCategory;
