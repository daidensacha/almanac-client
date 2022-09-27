import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import instance from '../../utils/axiosClient';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIos from '@mui/icons-material/ArrowBack';
import AnimatedPage from '../../components/AnimatedPage';
import { getCookie } from '../../utils/helpers';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const { id } = useParams();
  console.log('id', id);
  const navigate = useNavigate();

  const [values, setValues] = useState({});

  const token = getCookie('token');

  useEffect(() => {
    const getEvent = async () => {
      await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/event/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          console.log('GET EVENT SUCCESS', response.data);
          const {event} = response.data;
          console.log('eventValues', event);
          setValues(event);
          console.log('Values', event);
          console.log('values', values);
        })
        .catch(error => {
          console.log('GET EVENT ERROR', error.response.data.error);
          // if (error.response.status === 401) {
          //   signout(() => {
          //     navigate('/signin');
          //   });
          // }
        });
    };
    getEvent();
  }, [token]);

  const deleteCategory = async id => {
    try {
      const {
        data: { deleteCategory },
      } = await instance.delete(`/category/${id}`);
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
          <h1>Edit Event Page</h1>
          <p>Coming soon...</p>
          {values.name}
          <Button
            color='primary'
            variant='outlined'
            size='small'
            onClick={() => navigate(-1)}>
            <ArrowBackIos fontSize='small' />
            Back
          </Button>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EditEvent;
