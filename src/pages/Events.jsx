import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '@/utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, ButtonGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ListItem, ListItemText } from '@mui/material';
import { List, ListItemIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PageviewIcon from '@mui/icons-material/Pageview';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { toast } from 'react-toastify';
import { Fade, Zoom } from '@mui/material';
import Raspberries from '@/images/raspberries.jpg';
import AnimatedPage from '@/components/AnimatedPage';
import SearchBar from '@/components/ui/SearchFilter';
import moment from 'moment';
// import { useEventsContext } from '@/contexts/EventsContext';

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

  // const { events, setEvents } = useEventsContext();

  // console.log('EVENTS CONTEXT', events);

  const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const {
          data: { allEvents },
        } = await instance.get(`/events`);
        setEvents(allEvents);
      } catch (err) {
        console.log(err.response.data.error);
        toast.error(err.response.data.error);
        navigate('/events');
      }
    };
    getEvents();
  }, [navigate]);

  const archiveEvent = async (id) => {
    try {
      const {
        data: { archivedEvent },
      } = await instance.patch(`/event/archive/${id}`, {
        archived: true,
      });
      console.log('ARCHIVED EVENT', archivedEvent);
      handleClose();
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      console.log(err.response.data.error);
      toast.error(err.response.data.error);
    }
  };

  const [deleteCurrentEvent, setDeleteCurrentEvent] = useState(null);
  const deleteHandler = (e, id) => {
    setDeleteCurrentEvent(id);
    setOpen(true);
  };

  const [search, setSearch] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Prop variables for SearchBar
  const placeholder = 'Search Events';
  const helpertext = 'Search: event, plant, category or month';

  // Sort Events by Name
  const sortEvents = (a, b) => {
    return a.event_name.localeCompare(b.event_name);
  };

  useEffect(() => {
    setFilteredEvents(
      events.sort(sortEvents).filter((event) => {
        return (
          event.event_name.toLowerCase().includes(search.toLowerCase()) ||
          event.plant.common_name.toLowerCase().includes(search.toLowerCase()) ||
          event.category.category.toLowerCase().includes(search.toLowerCase()) ||
          moment(event.occurs_at).format('MMMM').toLowerCase().includes(search.toLowerCase())
        );
      }),
    );
  }, [search, events]);

  const onSearchChange = (searchQuery) => {
    setSearch(searchQuery);
  };

  const handleClearClick = () => {
    setSearch('');
  };

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1>Events</h1>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Fade in={true} timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Raspberries}
                ></Box>
              </Fade>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
              }}
            >
              <Box variant="container" sx={{ width: '100%' }}>
                <Stack direction="row" sx={{ justifyContent: 'center' }} spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      '& > *': {
                        m: 1,
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ mx: 'auto' }}
                      aria-label="small button group"
                    >
                      <Button onClick={() => navigate(`/plants`)}>Plants</Button>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/event/add')}
                      >
                        Event
                      </Button>
                      <Button onClick={() => navigate(`/categories`)}>Categories</Button>
                    </ButtonGroup>
                  </Box>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SearchBar
                    sx={{}}
                    found={filteredEvents}
                    helpertext={helpertext}
                    placeholder={placeholder}
                    onSearch={onSearchChange}
                    value={search}
                    handleClearClick={handleClearClick}
                  />
                </Box>
              </Box>
              <Zoom in={true} timeout={1000}>
                <TableContainer sx={{ maxWidth: 650 }}>
                  <Table
                    sx={{ width: 'max-content', mt: 1, mx: 'auto' }}
                    size="small"
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="left">Event</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredEvents?.map((row, index) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell align="left">{row.event_name}</TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              align="end"
                              spacing={2}
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <IconButton
                                size="small"
                                comonent="button"
                                aria-label="view"
                                color="info"
                                onClick={() => navigate(`/event/${row._id}`, { state: row })}
                              >
                                <PageviewIcon />
                              </IconButton>

                              <IconButton
                                size="small"
                                component="button"
                                aria-label="edit"
                                sx={{ color: 'secondary.main' }}
                                onClick={() =>
                                  navigate(`/event/edit/${row._id}`, {
                                    state: row,
                                  })
                                }
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                aria-label="delete"
                                sx={{ color: 'grey.700' }}
                                onClick={(e) => deleteHandler(e, row._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {/* Start modal */}
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Are you sure?
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Button
                              type="button"
                              fullWidth
                              variant="contained"
                              color="secondary"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={handleClose}
                            >
                              Cancel
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              type="button"
                              fullWidth
                              variant="contained"
                              color="error"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => archiveEvent(deleteCurrentEvent)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                    {/* End Modal */}
                  </Table>
                </TableContainer>
              </Zoom>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Fade in={true} timeout={2000}>
                <Box component="div" align="left" sx={{ width: '100%', height: 'auto', mt: 4 }}>
                  <Box size="small" color="primary" aria-label="tip" align="center">
                    <TipsAndUpdatesIcon sx={{ color: 'secondary.main', fontSize: '36px' }} />
                  </Box>
                  <Typography
                    variant="h3"
                    align="center"
                    sx={{ align: 'center', color: 'secondary.dark' }}
                  >
                    Tips
                  </Typography>
                  <List sx={{ dense: 'true', size: 'small' }}>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="The event triangle"
                        secondary="Plant - Event - Category. To create an event, you must first create a category and a plant."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Four Required fields"
                        secondary="Event name, category, plant, and date. Use the remaining fields to add more details as required."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Review and update"
                        secondary="Reference, review and update your events each year to ensure they are accurate. Each year your will find it easier with your reference of past years experience."
                      />
                    </ListItem>
                  </List>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Events;
