import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '../../components/AnimatedPage';
import { toast } from 'react-toastify';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [values, setValues] = useState({
    category: '',
    description: '',
    buttonText: 'Update Category',
  });

  // const [category, setCategory] = useState({});

  const handleValue = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  console.log('VALUES', values);

  // Why do I get a infinite loop here when deleting an item?
  useEffect(() => {
    const getCategory = async () => {
      try {
        const {
          data: { category },
        } = await instance.get(`/category/${id}`);
        console.log('GET CATEGORY SUCCESS', category);
        const category_name = category.category;
        const { description } = category;
        setValues(prev=>({...prev, category: category_name, description }));
        // setValues({ ...values, category: category_name, description });
        // toast.success('Category updated');
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error); // this works in the toast
        navigate('/categories'); // This redirect is better ui
      }
      // console.log('CATEGORY', category);
    };
    getCategory();
  }, [id, navigate]);
  // adding values to the dependency array causes an infinite loop here
  // What to do???

  const handleSubmit = async event => {
    event.preventDefault();
    console.table(values);
    setValues({ ...values, buttonText: '...Updating Category' });

    try {
      const {
        data: { message },
      } = await instance.put(`/category/edit/${id}`, {
        category: values.category,
        description: values.description,
      });
      console.log('CATEGORY UPDATED', message);
      setValues({ ...values, buttonText: 'Updated Category' });
      toast.success('Successfully updated');
      navigate('/categories');
    } catch (err) {
      console.log('CATEGORY UPDATE ERROR', err.response.data);
      setValues({ ...values, buttonText: 'Update Category' });
      toast.error(err.response.data.error);
    }
  };

  const deleteCategory = async () => {
    try {
      const {
        data: { deleteCategory },
      } = await instance.delete(`/category/delete/${id}`);
      console.log('DELETE CATEGORY SUCCESS', `${deleteCategory._id}`);
      toast.success(`${deleteCategory.category} successfully deleted`)
      navigate('/categories')

    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error)
      // load categories fresh somehow
    }
  }

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
              <Grid item xs={12} sm={6}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}>
                  {values.buttonText}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type='button'
                  fullWidth
                  variant='contained'
                  color='warning'
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleOpen}>
                  Delete
                </Button>
              </Grid>
            </Grid>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'>
              <Box sx={modalStyle}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  Delete category {values.category}
                </Typography>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button

                    type='button'
                    fullWidth
                    variant='contained'
                    color='secondary'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button

                    type='button'
                    fullWidth
                    variant='contained'
                    color='error'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => deleteCategory()}>
                    Delete
                  </Button>
                </Grid>
                </Grid>

              </Box>
            </Modal>

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

export default EditCategory;
