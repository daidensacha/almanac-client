import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import instance from '../utils/axiosClient';

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

import AnimatedPage from '../components/AnimatedPage';

import { toast } from 'react-toastify';
import { getCookie } from '../utils/helpers';

import CategoryModal from './CategoryModal';
// import { Preview } from '@mui/icons-material';

// const rows = [];

const Categories = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const token = getCookie('token');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await instance.get(`/categories`);
        console.log('SUCCESS CATEGORIES', data);
        setCategories(data);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        // navigate('/categories');
      }
    };
    getCategories();
  }, []);

  const handleStartAction = (e, id) => {
    //use this value to determine what action to take
    const action = e.currentTarget.getAttribute('aria-label');

    //determine which category are we opening the Modal for
    setCurrentCategoryId(id);

    setOpen(true);
    setActionType(action);
  };

  //compare function that keeps the order of the items in the array
  const compare = (a, b) => {
    const getTimeStamp = (value) => new Date(value).getTime();

    const aTimeStamp = getTimeStamp(a.created_at);
    const bTimeStamp = getTimeStamp(b.created_at);

    return aTimeStamp - bTimeStamp;
  };

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
          }}
        >
          <h1>Category List</h1>
          <Box my={1}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='Add'
                onClick={handleStartAction}
              >
                <AddIcon />
              </Fab>
            </Stack>
          </Box>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{}} size='small' aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align='left'>Category</TableCell>
                    <TableCell align='left'>Description</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actionType && (
                    <CategoryModal
                      currentCategoryId={currentCategoryId}
                      action={actionType}
                      open={open}
                      setOpen={setOpen}
                      categories={categories}
                      setCategories={setCategories}
                    />
                  )}
                  {categories?.sort(compare).map((row, index) => (
                    <React.Fragment key={row._id}>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {index + 1}
                        </TableCell>
                        <TableCell align='left'>{row.category}</TableCell>
                        <TableCell align='left'>{row.description}</TableCell>
                        <TableCell align='left'>
                          <Stack
                            direction='row'
                            align='end'
                            spacing={2}
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <IconButton
                              size='small'
                              comonent='button'
                              aria-label='view'
                              color='info'
                              onClick={() => navigate(`/category/${row._id}`)}
                            >
                              <VisibilityIcon />
                            </IconButton>

                            <IconButton
                              size='small'
                              component='button'
                              aria-label='Edit'
                              sx={{ color: 'secondary.main' }}
                              onClick={(e) => handleStartAction(e, row._id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              aria-label='Delete'
                              sx={{ color: 'grey.700' }}
                              // onClick = { () =>  navigate(`/category/edit/${row._id}`)}
                              onClick={(e) => handleStartAction(e, row._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        {/* Start modal */}

                        {/* End Modal */}
                      </TableRow>
                    </React.Fragment>
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
