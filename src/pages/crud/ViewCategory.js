import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AnimatedPage from '../../components/AnimatedPage';
// import { getCookie } from '../../utils/helpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
// import { ObjectId } from "mongodb";

// const rows = [];

const ViewCategory = () => {
  const { id } = useParams();
  console.log('ID', id);
  const navigate = useNavigate();

  // const token = getCookie('token');

  const [category, setCategory] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const {
          data: { category },
        } = await instance.get(`/category/${id}`);
        console.log('GET CATEGORY SUCCESS', category);
        setCategory(category);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error); // this works in the toast
        navigate('/categories'); // This redirect is better ui
      }
    };
    getCategory();
  }, [id, navigate]);

  // console.log('CATEGORY', category);

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='sm'>
        {/* <ToastContainer /> */}
        <Grid
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <h1>Category</h1>
          {/* <Box my={1}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/category/add')}>
                <AddIcon />
              </Fab>
            </Stack>
          </Box> */}
          <Grid item xs={12} sx={{ mt: 5}}>
            {/* <Typography variant='h6' gutterBottom component='div'>
              Category
            </Typography> */}
            <Typography variant='h6' gutterBottom component='div'>
              Category: {category.category}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Description: {category.description}
            </Typography>
          </Grid>
          {/* <Grid container> */}
          {/* <Grid item xs></Grid> */}
          <Grid item>
            <Link component={RouterLink} to='/categories' variant='body2'>
              {'Back to Categories'}
            </Link>
          </Grid>
          {/* </Grid> */}
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ViewCategory;
