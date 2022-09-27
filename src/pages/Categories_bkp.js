import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AnimatedPage from '../components/AnimatedPage';
import { getCookie } from '../utils/helpers';

const columns = [
  { field: 'num', headerName: 'Number', width: 70 },
  { field: 'cat', headerName: 'Category', width: 120 },
  { field: 'desc', headerName: 'Description', width: 230 },
];

// const rows = [];

const Categories = () => {
  const navigate = useNavigate();

  const token = getCookie('token');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/categories`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          console.log('GET CATEGORIES SUCCESS', response.data);
          const categories = response.data;
          setCategories(categories);
          console.log('CATEGORIES', categories);
        })
        .catch(error => {
          console.log('GET CATEGORIES ERROR', error.response.data.error);
          if (error.response.status === 401) {
            navigate('/login');
          }
        });
    };
    getCategories();
  }, [token]);

  const rows = categories?.map((category, index) => {
    return {
      id: category._id,
      num: index + 1,
      cat: category.category,
      desc: category.description,
    };
  });

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
          <Grid item xs={12}>
            <h1>Categories Page</h1>
            <p>Construction in progress...</p>
            <Box style={{ height: 400, minWidth: '100vh' }}>
              <DataGrid
                getRowId={row => row.id}
                rows={rows}
                // minWidth={'800px'}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
              />
            </Box>
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
