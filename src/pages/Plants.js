import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AnimatedPage from '../components/AnimatedPage';
import Grid from '@mui/material/Grid';
import {Fade, Zoom} from '@mui/material';
// import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckIcon from '@mui/icons-material/Check';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Cherry from '../images/quaritsch-photography--5FRm3GHdrU-unsplash.jpg';
// import VisibilityIcon from '@mui/icons-material/Visibility';
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
import instance from '../utils/axiosClient';
import Gerkins from '../images/mockup-graphics-UrLT3x0x9sA-unsplash.jpg';
import Berries from '../images/mockup-graphics-mw233LhCbQ8-unsplash.jpg';
import RandomImage from '../images/RandomImage';

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

  const randomImage = RandomImage();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const getPlants = async () => {
      try {
        const {
          data: { allPlants },
        } = await instance.get(`/plants`);
        console.log('SUCCESS PLANT', allPlants);
        setPlants(allPlants);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/plants');
      }
    };
    getPlants();
  }, [navigate]);

  const archivePlant = async id => {
    // console.log('DELETE', id);
    try {
      const {
        data: { archivedPlant },
      } = await instance.patch(`/plant/archive/${id}`, {
        archived: true,
      });
      console.log('ARCHIVE PLANT SUCCESS', `${archivedPlant.archived}`);
      handleClose();
      toast.success(`${archivedPlant.common_name} successfully archived`);
      setPlants(prev => prev.filter(plant => plant._id !== id));
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error);
    }
  };

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xl'>
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <h1>Plants Page</h1>
          <Box my={4}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/plant/add')}>
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
                  src={Berries}></Box>
              </Fade>
            </Grid>
            {/* Start grid here */}
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
                      <TableCell align='left'>Plant</TableCell>
                      {/* <TableCell align='left'>Description</TableCell> */}
                      <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {plants?.map((row, index) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell component='th' scope='row'>
                          {index + 1}
                        </TableCell>
                        <TableCell align='left'>{row.common_name}</TableCell>
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
                                navigate(`/plant/${row._id}`, { state: row })
                              }>
                              <PageviewIcon />
                            </IconButton>

                            <IconButton
                              size='small'
                              component='button'
                              aria-label='edit'
                              sx={{ color: 'secondary.main' }}
                              onClick={() =>
                                navigate(`/plant/edit/${row._id}`, {
                                  state: row,
                                })
                              }>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              aria-label='delete'
                              sx={{ color: 'grey.700' }}
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
                                  onClick={() => archivePlant(row._id)}>
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
                      primary='Your plant reference'
                      secondary='The starting point is here, with as little or as much info as is useful. Tou can add, update and remove plants.'
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <CheckIcon color='success' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Update plant information'
                      secondary='Add watering and fertilizing schedules, add pests and diseases, add notes and more.'
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <CheckIcon color='success' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Refine with experience'
                      secondary='As you gain experience, you can refine your plant information. Add more details, add more notes.'
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
            {/* End grid here */}
          </Grid>
          <Box my={1}></Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Plants;
