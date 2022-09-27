import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import AnimatedPage from '../components/AnimatedPage';
import { getCookie } from '../utils/helpers';

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



const Events = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [events, setEvents] = useState([]);

  const token = getCookie('token');
  // console.log(token) // token is there
  useEffect(() => {
    const getEvents = async () => {
      await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/events`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          console.log('GET EVENTS SUCCESS', response.data);
          setEvents(response.data);
        })
        .catch(error => {
          console.log('GET EVENTS ERROR', error.response.data);
          // if (error.response.status === 401) {
          //   signout(() => {
          //     navigate('/signin');
          //   });
          // }
        });
    };
    getEvents();
  }, [token]);

  return (
    <AnimatedPage>
      {/* <Container component='main' maxWidth='xs'>
       */}
      <Container component='div' maxWidth='lg'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
          {/* <Grid item xs={12} md={6}> */}
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Avatar with text and icon
          </Typography>
          {/* <Demo> */}
            <List>
              {events.map((event, i) => (
              <ListItem
              key={i}
              // viewAction={
              //   <IconButton
              //     edge='end'
              //     aria-label='view'
              //     onClick={() => navigate(`/event/${event._id}`)}
              //   >
              //     <VisibilityIcon />
              //   </IconButton>
              // }
              // secondaryAction={
              //   <IconButton edge="end" aria-label="delete">
              //     <DeleteIcon color='error' />
              //   </IconButton>
              // }
              >
                <ListItemText
                  primary={event.name}
                  // secondary={secondary.main ? 'Secondary text' : null}
                />
                {event._id}
                <Stack direction='row' spacing={2}>
                  <IconButton
                    size='small'
                    comonent='button'
                    aria-label='view'
                    color='info'
                    // onClick={() => navigate(`/event/${event._id}`)
                    onClick={handleOpen}
                  // }
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    size='small'
                    component='button'
                    aria-label='edit'
                    sx={{ color: 'secondary.main' }}
                    onClick={() => navigate(`/event/edit/${event._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    aria-label='delete'
                    sx={{ color: 'grey.700' }}
                    // onClick = { () =>  }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                {/* <IconButton edge="end" aria-label="delete">
                  <VisibilityIcon color='secondary'/>
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <EditIcon color='info'/>
                </IconButton> */}
              </ListItem>
                ))}

            </List>
          {/* </Demo> */}
        {/* </Grid> */}
      {/* </Grid> */}
          </Grid>
        </Grid>
         <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <h1>Events Page</h1>
          <p>Coming soon...</p>
          <Box component='div' sx={{}}>

        </Box>
         {/* <Box my={1}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/events/add')}>
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
                onClick={() => navigate('/events/edit')}>
                <EditIcon />
              </IconButton>
            </Stack>
          </Box>*/}
        </Box>

      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </AnimatedPage>
  );
};

export default Events;
