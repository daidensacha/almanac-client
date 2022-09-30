import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../utils/axiosClient';
// import axios from 'axios';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ListItem, ListItemText } from '@mui/material';
import { List, ListItemIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PageviewIcon from '@mui/icons-material/Pageview';
import EventIcon from '@mui/icons-material/Event';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { toast } from 'react-toastify';
import { Fade, Zoom } from '@mui/material';
import Berries from '../images/mockup-graphics-mw233LhCbQ8-unsplash.jpg';
import Raspberries from '../images/mockup-graphics-TvPoJ6GWNmc-unsplash.jpg';

import AnimatedPage from '../components/AnimatedPage';
import { ConstructionOutlined } from '@mui/icons-material';
// import { getCookie } from '../utils/helpers';

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

  useEffect(() => {
    const getEvents = async () => {
      try {
        const {
          data: { allEvents },
        } = await instance.get(`/events`);
        console.log('SUCCESS EVENTS', allEvents);
        setEvents(allEvents);
        console.log('allEvents', allEvents);
      } catch (err) {
        console.log(err.response.data.error);
        toast.error(err.response.data.error);
        navigate('/events');
      }
    };
    getEvents();
  }, [navigate]);

  console.log('EVENTS', events);

  const archiveEvent = async id => {
    try {
      const {
        data: { archivedEvent },
      } = await instance.patch(`/event/archive/${id}`, {
        archived: true,
      });
      console.log('ARCHIVE EVENT SUCCESS', `${archivedEvent.archived}`);
      handleClose();
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error);
    }
  };

  return (
    <AnimatedPage>
      {/* <Container component='main' maxWidth='xs'>
       */}
      <Container component='div' maxWidth='xl'>
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

          <Box my={4}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/event/add')}>
                <AddIcon />
              </Fab>
            </Stack>
          </Box>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Fade in={true} timeout={2000}>
                <Box
                  component='img'
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt='image'
                  src={Raspberries}></Box>
              </Fade>
            </Grid>
            {/*  Start grid here */}

            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'flex-start',
              }}>
              <TableContainer sx={{ maxWidth: 650 }}>
                <Table
                  sx={{ width: 'max-content', mt: 4, mx: 'auto' }}
                  size='small'
                  aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell align='left'>Event</TableCell>
                      {/* <TableCell align='left'>Description</TableCell> */}
                      <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events?.map((row, index) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell component='th' scope='row'>
                          {index + 1}
                        </TableCell>
                        <TableCell align='left'>{row.event_name}</TableCell>
                        {/* <TableCell align='left'>{row.description}</TableCell> */}
                        <TableCell align='center'>
                          <Stack
                            direction='row'
                            align='end'
                            spacing={2}
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}>
                            <IconButton
                              size='small'
                              comonent='button'
                              aria-label='view'
                              color='info'
                              onClick={() =>
                                navigate(`/event/${row._id}`, { state: row })
                              }>
                              <PageviewIcon />
                            </IconButton>

                            <IconButton
                              size='small'
                              component='button'
                              aria-label='edit'
                              sx={{ color: 'secondary.main' }}
                              onClick={() =>
                                navigate(`/event/edit/${row._id}`, {
                                  state: row,
                                })
                              }>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              aria-label='delete'
                              sx={{ color: 'grey.700' }}
                              // onClick = { () =>  navigate(`/category/edit/${row._id}`)}
                              onClick={() => setOpen(true)}>
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
                            <Typography
                              id='modal-modal-title'
                              variant='h6'
                              component='h2'>
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
                                  onClick={() => archiveEvent(row._id)}>
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
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Box
                component='div'
                align='left'
                sx={{ width: '100%', height: 'auto', mt: 4 }}>
                <Box
                  size='small'
                  color='primary'
                  aria-label='tip'
                  align='center'>
                  <TipsAndUpdatesIcon
                    sx={{ color: 'secondary.main', fontSize: '36px' }}
                  />
                </Box>
                <Typography
                  variant='h3'
                  align='center'
                  sx={{ align: 'center', color: 'secondary.dark' }}>
                  Tips
                </Typography>
                {/* <Typography variant='body1' align="left" sx={{align: 'left',}}>

                    1. <strong>Actions</strong> repesent actions.
                  </Typography> */}
                <List sx={{ dense: 'true', size: 'small' }}>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <CheckIcon color='success' />
                    </ListItemIcon>
                    <ListItemText
                      primary='The event triangle'
                      secondary='Plant - Event - Category. To create an event, you must first create a category and a plant.'
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <CheckIcon color='success' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Four Required fields'
                      secondary='Event name, category, plant, and date. Use the remaining fields to add more details as required.'
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <CheckIcon color='success' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Review and update'
                      secondary='Reference, review and update your events each year to ensure they are accurate. Each year your will find it easier with your reference of past years experience.'
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>

            {/* End grid here */}
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Events;
