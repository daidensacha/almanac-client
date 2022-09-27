import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import instance from '../utils/axiosClient';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import AnimatedPage from '../components/AnimatedPage';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { getCookie } from '../utils/helpers';
// import { Preview } from '@mui/icons-material';

// const rows = [];

const Categories = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
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

  const token = getCookie('token');

  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const getCategories = async () => {
  //     await axios({
  //       method: 'GET',
  //       url: `${process.env.REACT_APP_API}/categories`,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then(response => {
  //         console.log('GET CATEGORIES SUCCESS', response.data);
  //         const categories = response.data;
  //         setCategories(categories);
  //         console.log('CATEGORIES', categories);
  //       })
  //       .catch(error => {
  //         console.log('GET CATEGORIES ERROR', error.response.data.error);
  //         if (error.response.status === 401) {
  //           navigate('/login');
  //         }
  //       });
  //   };
  //   getCategories();
  // }, [token, navigate]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const {
          data: { allCategories },
        } = await instance.get(`/categories`);
        console.log('SUCCESS CATEGORIES', allCategories);
        setCategories(allCategories)
      }catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/categories')
      }
  };
    getCategories();
  }, [navigate]);

  const deleteCategory = async (id) => {
    // console.log('DELETE', id);
    try {
      const {
        data: { deleteCategory },
      } = await instance.delete(`/category/delete/${id}`);
      console.log('DELETE CATEGORY SUCCESS', `${deleteCategory._id}`);
      toast.success(`${deleteCategory.category} successfully deleted`)
      setOpen(false);
      // navigate('/categories')
      setCategories(prev=>prev.filter(category=>category._id !== id));

    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error)
      // load categories fresh somehow
    }
  }

  // <Navigate to <AddCategory /> />
  // <Component id={row._id} />


  // const handleDelete = async id => {
  //   console.log('DELETE', id);
  //   if (window.confirm('Delete?')) {
  //     await instance
  //       .delete(`/category/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then(response => {
  //         console.log('CATEGORY DELETE SUCCESS', response);
  //         // load all categories
  //         loadCategories();
  //       })
  //       .catch(error => {
  //         console.log('CATEGORY DELETE ERROR', error);
  //         if (error.response.status === 401) {
  //           navigate('/login');
  //         }
  //       });
  //   }
  // };

  // console.log('CATEGORIES', categories);

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='sm'>
        <Grid
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h1>Category List</h1>
            <Box my={1}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/category/add')}>
                <AddIcon />
              </Fab>
            </Stack>
          </Box>
          <Grid item xs={12}>


            <TableContainer sx={{ maxWidth: 650 }} >
              <Table sx={{ width: 'max-content' }} size='small' aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align='left'>Category</TableCell>
                    {/* <TableCell align='left'>Description</TableCell> */}
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories?.map((row, index) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}>
                      <TableCell component='th' scope='row'>
                        {index +1}
                      </TableCell>
                      <TableCell align='left'>{row.category}</TableCell>
                      {/* <TableCell align='left'>{row.description}</TableCell> */}
                      <TableCell align='center'>
                        <Stack direction='row' align='end' spacing={2} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                          <IconButton
                            size='small'
                            comonent='button'
                            aria-label='view'
                            color='info'
                            onClick={() => navigate(`/category/${row._id}`)}>
                            <VisibilityIcon />
                          </IconButton>

                          <IconButton
                            size='small'
                            component='button'
                            aria-label='edit'
                            sx={{ color: 'secondary.main' }}
                            onClick={() => navigate(`/category/edit/${row._id}`)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size='small'
                            aria-label='delete'
                            sx={{ color: 'grey.700' }}
                            // onClick = { () =>  navigate(`/category/edit/${row._id}`)}
                            onClick={() => setOpen(true)}
                            >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      {/* Start modal */}
                      <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby='modal-modal-title'
                      aria-describedby='modal-modal-description'>
                      <Box sx={modalStyle}>
                        <Typography id='modal-modal-title' variant='h6' component='h2'>
                          {/* Delete category {values.category} */}
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
                            onClick={() => deleteCategory(row._id)}
                            >
                            Delete
                          </Button>
                        </Grid>
                        </Grid>

                      </Box>
                    </Modal>
                    {/* End Modal */}
                    </TableRow>

                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* <Box my={1}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/categories/add')}>
                <AddIcon />
              </Fab>
            </Stack>
          </Box>
          <Box my={1}>
            <Stack direction='row' spacing={2}>
              <IconButton
                size='small'
                aria-label='delete'
                sx={{ color: 'grey.700' }}
                // onClick = { () =>  }
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                size='small'
                component='button'
                aria-label='edit'
                sx={{ color: 'secondary.main' }}
                onClick={() => navigate('/categories/edit')}>
                <EditIcon />
              </IconButton>
            </Stack>
          </Box> */}
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default Categories;
