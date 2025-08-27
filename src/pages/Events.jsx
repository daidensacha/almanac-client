// src/pages/Events.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/axiosClient';

import AnimatedPage from '@/components/AnimatedPage';
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs';
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
import SearchBar from '@/components/ui/SearchFilter';
import dayjs from 'dayjs';
import { normalizeEvent } from '@/utils/normalizers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvents, keys as eventKeys } from '@/queries/useEvents';

export const keys = {
  all: ['events'],
  list: (archived) => ['events', 'list', archived],
};

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

export default function Events() {
  const navigate = useNavigate();
  const eventsQ = useEvents(false, { retry: false });

  // 2) Local UI state
  const [open, setOpen] = useState(false);
  const [deleteCurrentEvent, setDeleteCurrentEvent] = useState(null);
  const handleClose = () => setOpen(false);

  const [search, setSearch] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  // 3) Derive filtered list when query data or search changes
  useEffect(() => {
    const source = Array.isArray(eventsQ.data) ? eventsQ.data : [];
    const sortByName = (a, b) => (a?.event_name || '').localeCompare(b?.event_name || '');
    const q = search.toLowerCase();

    const filtered = source
      .slice()
      .sort(sortByName)
      .filter((ev) => {
        const name = ev?.event_name?.toLowerCase() || '';
        const plant =
          (typeof ev?.plant === 'object' ? ev?.plant?.common_name : '')?.toLowerCase() || '';
        const cat =
          (typeof ev?.category === 'object' ? ev?.category?.category_name : '')?.toLowerCase() ||
          '';
        const month = ev?.occurs_at ? dayjs(ev.occurs_at).format('MMMM').toLowerCase() : '';
        return name.includes(q) || plant.includes(q) || cat.includes(q) || month.includes(q);
      });

    setFilteredEvents(filtered);
  }, [search, eventsQ.data]);

  const qc = useQueryClient();
  const archiveMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/event/archive/${id}`, { archived: true });
      return data; // updated event doc
    },
    onSuccess: (data) => {
      toast.success(`${data?.event_name || data?.archivedEvent?.event_name || 'Event'} archived`);
      qc.invalidateQueries({ queryKey: eventKeys.all, exact: false });
      handleClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to archive event');
    },
  });

  // 4) Loading / error states (safe for hooks)
  if (eventsQ.isLoading) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xl">
          <Box sx={{ mt: 8 }}>Loading events…</Box>
        </Container>
      </AnimatedPage>
    );
  }
  if (eventsQ.error) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xl">
          <Box sx={{ mt: 8, color: 'error.main' }}>Failed to load events</Box>
        </Container>
      </AnimatedPage>
    );
  }

  // 5) Handlers
  const deleteHandler = (_e, id) => {
    setDeleteCurrentEvent(id);
    setOpen(true);
  };

  const onSearchChange = (q) => setSearch(q);
  const handleClearClick = () => setSearch('');

  // 6) Render
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
          <AppBreadcrumbs
            center
            segmentsMap={{
              admin: 'Admin',
              almanac: 'Almanac',
              plants: 'Plants',
              events: 'Events',
              categories: { label: 'Categories', to: '/categories' },
              add: 'Add',
              edit: 'Edit',
              view: 'View',
            }}
          />

          <h1>Events</h1>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
            >
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Raspberries}
                />
              </Fade>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" sx={{ justifyContent: 'center' }} spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      '& > *': { m: 1 },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ mx: 'auto' }}
                    >
                      <Button onClick={() => navigate('/plants')}>Plants</Button>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/event/add')}
                      >
                        Event
                      </Button>
                      <Button onClick={() => navigate('/categories')}>Categories</Button>
                    </ButtonGroup>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SearchBar
                    found={filteredEvents}
                    helpertext="Search: event, plant, category or month"
                    placeholder="Search Events"
                    onSearch={onSearchChange}
                    value={search}
                    handleClearClick={handleClearClick}
                  />
                </Box>
              </Box>

              <Zoom in timeout={1000}>
                <TableContainer sx={{ maxWidth: 650 }}>
                  <Table sx={{ width: 'max-content', mt: 1, mx: 'auto' }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="left">Event</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredEvents.map((row, index) => (
                        <TableRow
                          key={row._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell align="left">{row.event_name}</TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                aria-label="view"
                                color="info"
                                onClick={() => navigate(`/event/${row._id}`, { state: row })}
                              >
                                <PageviewIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                aria-label="edit"
                                sx={{ color: 'secondary.main' }}
                                onClick={() => navigate(`/event/edit/${row._id}`, { state: row })}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                aria-label="delete"
                                sx={{ color: 'grey.700' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteHandler(e, row._id);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    {/* Modal */}
                    <Modal open={open} onClose={handleClose}>
                      <Box sx={modalStyle}>
                        <Typography variant="h6">Are you sure?</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Button
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
                              fullWidth
                              variant="contained"
                              color="error"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => archiveMutation.mutate(deleteCurrentEvent)}
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
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
            >
              <Fade in timeout={2000}>
                <Box align="left" sx={{ width: '100%', mt: 4 }}>
                  <Box align="center">
                    <TipsAndUpdatesIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
                  </Box>
                  <Typography variant="h3" align="center" sx={{ color: 'secondary.dark' }}>
                    Tips
                  </Typography>
                  <List dense>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="The event triangle"
                        secondary="Plant - Event - Category. Create a category and a plant first."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Four required fields"
                        secondary="Event name, category, plant, and date."
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
}
