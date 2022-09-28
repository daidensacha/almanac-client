import { useState } from 'react';

import instance from '../utils/axiosClient';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';

import Typography from '@mui/material/Typography';

// import { Preview } from '@mui/icons-material';
const CategoryModal = ({
  action,
  open,
  setOpen,
  setCategories,
  currentCategoryId,
}) => {
  // define text of button based on action type

  const buttonText = `${action} Category`;
  const [values, setValues] = useState({
    category: '',
    description: '',
  });

  const handleClose = () => setOpen(false);

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

  const handleValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const addCategory = async () => {
    try {
      const { data } = await instance.post(
        `/categories/${currentCategoryId}`,
        values
      );
      console.log(data);
      setCategories((prev) => [...prev, data]);
      setValues({
        category: '',
        description: '',
      });
      //toast.success(data.data.message);
      // navigate('/admin/categories');
    } catch (error) {
      console.log('CATEGORY ADD ERROR', error);
      //   setValues({ ...values, buttonText: 'Add Category' });
      //   toast.error(error.response.data.error);
    }
  };

  const editCategory = async (e) => {
    try {
      const { data } = await instance.put(
        `/categories/${currentCategoryId}`,
        values
      );
      //spread state, exclude current category, add updated category
      setCategories((prev) => [
        ...prev.filter((category) => category._id !== currentCategoryId),
        data,
      ]);

      setValues({
        category: '',
        description: '',
      });

      toast.success('Successfully updated');
      //  navigate('/categories');
    } catch (err) {
      console.log('CATEGORY UPDATE ERROR', err.response.data);
      setValues({ ...values, buttonText: 'Update Category' });
      toast.error(err.response.data.error);
    }
  };
  //   };
  const deleteCategory = async (e) => {
    try {
      const { data } = await instance.delete(
        `/categories/${currentCategoryId}`
      );

      console.log('DELETE CATEGORY SUCCESS', data);
      toast.success(`${data.category} successfully deleted`);

      setCategories((prev) =>
        prev.filter((category) => category._id !== currentCategoryId)
      );
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.error);
      // load categories fresh somehow
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    action === 'Add' && addCategory(event);
    action === 'Edit' && editCategory(event);
    action === 'Delete' && deleteCategory();

    handleClose();
  };

  return action === 'Delete' ? (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={modalStyle}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Are you sure?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              type='button'
              fullWidth
              variant='contained'
              color='secondary'
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClose}
            >
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
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  ) : (
    <Modal
      open={open}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Container component='main' maxWidth='xs'>
        <Box sx={modalStyle}>
          <h1>{action} Category</h1>

          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
              value={values?.description}
              name='description'
              label='Description'
              id='description'
              size='small'
              onChange={handleValues}
            />
            {/* </Grid> */}
            <Button
              onClick={handleSubmit}
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              {buttonText}
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                {/* <Link component={RouterLink} to='/categories' variant='body2'>
                  {'Back to Categories'}
                </Link> */}
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
    </Modal>
  );
};

export default CategoryModal;
