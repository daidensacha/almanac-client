// Plants.jsx (fixed order of hooks)
import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/axiosClient';

import AnimatedPage from '@/components/AnimatedPage';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Fade, Zoom } from '@mui/material';
import { ButtonGroup, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import PageviewIcon from '@mui/icons-material/Pageview';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { toast } from 'react-toastify';
import instance from '@/utils/axiosClient';
import SearchBar from '@/components/ui/SearchFilter';
import Berries from '@/images/berries.jpg';
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs';

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

export default function Plants() {
  const navigate = useNavigate();

  // 1) QUERY FIRST — always called
  const plantsQ = useQuery({
    queryKey: ['plants:mine'],
    queryFn: async () => {
      const { data } = await api.get('/plants'); // server scopes to req.auth._id
      return Array.isArray(data?.allPlants) ? data.allPlants : [];
    },
    refetchOnWindowFocus: false,
  });

  // 2) LOCAL STATE — always called
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [deleteCurrentPlant, setDeleteCurrentPlant] = useState(null);

  const [search, setSearch] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);

  // 3) EFFECTS — always called
  useEffect(() => {
    const source = Array.isArray(plantsQ.data) ? plantsQ.data : [];
    const sortPlants = (a, b) => (a?.common_name || '').localeCompare(b?.common_name || '');
    const filtered = source
      .slice()
      .sort(sortPlants)
      .filter((p) => {
        const cn = p?.common_name?.toLowerCase() || '';
        const bn = p?.botanical_name?.toLowerCase() || '';
        const q = search.toLowerCase();
        return cn.includes(q) || bn.includes(q);
      });
    setFilteredPlants(filtered);
  }, [search, plantsQ.data]);

  // 4) NOW conditional returns are safe
  if (plantsQ.isLoading) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xl">
          <Box sx={{ mt: 8 }}>Loading plants…</Box>
        </Container>
      </AnimatedPage>
    );
  }
  if (plantsQ.error) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xl">
          <Box sx={{ mt: 8, color: 'error.main' }}>Failed to load plants</Box>
        </Container>
      </AnimatedPage>
    );
  }

  // Handlers
  const deleteHandler = (_e, id) => {
    setDeleteCurrentPlant(id);
    setOpen(true);
  };

  const archivePlant = async (id) => {
    try {
      const { data } = await instance.patch(`/plant/archive/${id}`, { archived: true });
      handleClose();
      toast.success(`${data?.archivedPlant?.common_name || 'Plant'} archived`);
      plantsQ.refetch(); // refresh from server
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to archive plant');
    }
  };

  const onSearchChange = (q) => setSearch(q);
  const handleClearClick = () => setSearch('');

  // 5) RENDER
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
              // Optional: remap verbs to nicer labels
              add: 'Add',
              edit: 'Edit',
            }}
            // Optional: custom labels for IDs / slugs
            paramResolver={(seg, idx, segments) => {
              if (looksLikeId(seg)) return 'Details'; // or 'Item'
              return null; // fall back to default
            }}
          />
          <h1>Plants</h1>

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
                  src={Berries}
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
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/plant/add')}
                      >
                        Plant
                      </Button>
                      <Button color="secondary" onClick={() => navigate('/events')}>
                        Events
                      </Button>
                      <Button onClick={() => navigate('/categories')}>Categories</Button>
                    </ButtonGroup>
                  </Box>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SearchBar
                    sx={{ mx: 'auto' }}
                    found={filteredPlants}
                    helpertext="Search: Common or Botanical name"
                    placeholder="Search Plants"
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
                        <TableCell align="left">Plant</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPlants.map((row, index) => (
                        <TableRow
                          key={row._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell align="left">{row.common_name}</TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                aria-label="view"
                                color="info"
                                onClick={() => navigate(`/plant/${row._id}`, { state: row })}
                              >
                                <PageviewIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                aria-label="edit"
                                sx={{ color: 'secondary.main' }}
                                onClick={() => navigate(`/plant/edit/${row._id}`, { state: row })}
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
                              onClick={() => archivePlant(deleteCurrentPlant)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                    {/* End modal */}
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
                        primary="Your plant reference"
                        secondary="Start simple; add details over time. You can add, update and archive plants."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Update plant information"
                        secondary="Watering and fertilizing schedules, pests, diseases, and notes."
                      />
                    </ListItem>
                  </List>
                </Box>
              </Fade>
            </Grid>
          </Grid>
          <Box my={1} />
        </Box>
      </Container>
    </AnimatedPage>
  );
}
