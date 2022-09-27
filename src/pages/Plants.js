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
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
        setPlants(allPlants)
      }catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/plants')
      }
  };
  getPlants();
  }, [navigate]);


  const deletePlant = async (id) => {
    // console.log('DELETE', id);
    try {
      const {
        data: { deletePlant },
      } = await instance.delete(`/plant/delete/${id}`);
      console.log('DELETE PLANT SUCCESS', `${deletePlant._id}`);
      toast.success(`${deletePlant.common_name} successfully deleted`)
      setOpen(false);
      // navigate('/categories')
      setPlants(prev=>prev.filter(plant=>plant._id !== id));

    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error)
      // load categories fresh somehow
    }
  }

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='md'>
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
          <Box my={1}>
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
          {/* Start grid here */}
          <Grid item xs={12}>
          <TableContainer sx={{ maxWidth: 650 }} >
              <Table sx={{ width: 'max-content' }} size='small' aria-label='simple table'>
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
                        {index +1}
                      </TableCell>
                      <TableCell align='left'>{row.common_name}</TableCell>
                      {/* <TableCell align='left'>{row.description}</TableCell> */}
                      <TableCell align='center'>
                        <Stack direction='row' align='end' spacing={2} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                          <IconButton
                            size='small'
                            comonent='button'
                            aria-label='view'
                            color='info'
                            onClick={() => navigate(`/plant/${row._id}`)}>
                            <VisibilityIcon />
                          </IconButton>

                          <IconButton
                            size='small'
                            component='button'
                            aria-label='edit'
                            sx={{ color: 'secondary.main' }}
                            onClick={() => navigate(`/plant/edit/${row._id}`)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size='small'
                            aria-label='delete'
                            sx={{ color: 'grey.700' }}
                            // onClick = { () =>  navigate(`/category/edit/${row._id}`)}
                            onClick={() => setOpen(true)}
                            >
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
                        <Typography id='modal-modal-title' variant='h6' component='h2'>
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
                            onClick={() => deletePlant(row._id)}
                            >
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

          {/* <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{  }}>
                <CardMedia
                  component='img'
                  height='140'
                  image='/static/images/cards/contemplative-reptile.jpg'
                  alt='green iguana'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    Lizard
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size='small'>Share</Button>
                  <Button size='small'>Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{  }}>
                <CardMedia
                  component='img'
                  height='140'
                  image='/static/images/cards/contemplative-reptile.jpg'
                  alt='green iguana'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    Lizard
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size='small'>Share</Button>
                  <Button size='small'>Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}

          {/* End grid here */}

          <Box my={1}>
            {/* <Stack direction='row' spacing={2}>
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
                onClick={() => navigate('/plant/edit')}>
                <EditIcon />
              </IconButton>
            </Stack> */}
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Plants;
