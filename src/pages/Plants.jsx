import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AnimatedPage from '@/components/AnimatedPage';
import Grid from '@mui/material/Grid';
import { Fade, Zoom } from '@mui/material';
import { ButtonGroup, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckIcon from '@mui/icons-material/Check';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PageviewIcon from '@mui/icons-material/Pageview';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { toast } from 'react-toastify';
import instance from '@/utils/axiosClient';
import Berries from '@/images/berries.jpg';
// import RandomImage from '@/images/RandomImage';
import SearchBar from '@/components/ui/SearchFilter';
import { usePlantsContext } from '@/contexts/PlantsContext';

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

const Plants = () => {
  const navigate = useNavigate();

  const { plants, setPlants } = usePlantsContext();
  // const randomImage = RandomImage();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const archivePlant = async (id) => {
    try {
      const {
        data: { archivedPlant },
      } = await instance.patch(`/plant/archive/${id}`, {
        archived: true,
      });

      handleClose();
      setPlants((prev) => prev.filter((plant) => plant._id !== id));
      console.log('ARCHIVE PLANT SUCCESS', `${archivedPlant.archived}`);
      toast.success(`${archivedPlant.common_name} successfully archived`);
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error);
    }
  };

  const [deleteCurrentPlant, setDeleteCurrentPlant] = useState(null);
  const deleteHandler = (e, id) => {
    setDeleteCurrentPlant(id);
    setOpen(true);
  };

  // start of search filter
  const [search, setSearch] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);
  // console.log('search', search);

  // Prop variables for SearchBar
  const placeholder = 'Search Plants';
  const helpertext = 'Search: Common or Botanical name';

  // Sort Plants by Name
  const sortPlants = (a, b) => {
    return a?.common_name.localeCompare(b?.common_name);
  };

  useEffect(() => {
    setFilteredPlants(
      plants?.sort(sortPlants).filter((plant) => {
        return (
          plant?.common_name.toLowerCase().includes(search.toLowerCase()) ||
          plant?.botanical_name.toLowerCase().includes(search.toLowerCase())
        );
      }),
    );
  }, [search, plants]);

  // console.log('filteredPlants', filteredPlants);

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
          <h1>Plants</h1>

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
                  src={Berries}
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
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/plant/add`)}
                      >
                        Plant
                      </Button>
                      <Button color="secondary" onClick={() => navigate('/events')}>
                        Events
                      </Button>
                      <Button onClick={() => navigate(`/categories`)}>Categories</Button>
                    </ButtonGroup>
                  </Box>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SearchBar
                    sx={{ mx: 'auto' }}
                    found={filteredPlants}
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
                        <TableCell align="left">Plant</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPlants?.map((row, index) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell align="left">{row.common_name}</TableCell>
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
                                onClick={() => navigate(`/plant/${row._id}`, { state: row })}
                              >
                                <PageviewIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                component="button"
                                aria-label="edit"
                                sx={{ color: 'secondary.main' }}
                                onClick={() =>
                                  navigate(`/plant/edit/${row._id}`, {
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
                        primary="Your plant reference"
                        secondary="The starting point is here, with as little or as much info as is useful. Tou can add, update and remove plants."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Update plant information"
                        secondary="Add watering and fertilizing schedules, add pests and diseases, add notes and more."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Refine with experience"
                        secondary="As you gain experience, you can refine your plant information. Add more details, add more notes."
                      />
                    </ListItem>
                  </List>
                </Box>
              </Fade>
            </Grid>
          </Grid>
          <Box my={1}></Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Plants;
