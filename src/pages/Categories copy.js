import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import instance from '../utils/axiosClient';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { List, ListItem, ListItemText } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import CheckIcon from '@mui/icons-material/Check';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { Fade, Zoom } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Typography from '@mui/material/Typography';
import AnimatedPage from '../components/AnimatedPage';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { getCookie } from '../utils/helpers';
// import { Preview } from '@mui/icons-material';
import Cherry from '../images/quaritsch-photography--5FRm3GHdrU-unsplash.jpg';
import Pumpkins from '../images/tijana-drndarski-pZjTMVTGjlc-unsplash.jpg';
import Broccoli from '../images/mockup-graphics-q7BJL1qZ1Bw-unsplash.jpg';

// const rows = [];

const Categories = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [showDescription, setShowDescription] = useState(false);

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

  const token = getCookie('token');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const {
          data: { allCategories },
        } = await instance.get(`/categories`);
        console.log('SUCCESS CATEGORIES', allCategories);
        setCategories(allCategories);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
        navigate('/categories');
      }
    };
    getCategories();
  }, [navigate]);

  const archiveCategory = async id => {
    try {
      const {
        data: { archiveCategory },
      } = await instance.patch(`/category/archive/${id}`, {
        archived: true,
      });
      console.log('ARCHIVE PLANT SUCCESS', `${archiveCategory.archived}`);
      handleClose();
      setCategories(prev => prev.filter(category => category._id !== id));
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data.error);
      // load categories fresh somehow
    }
  };

  // function to create table rows
  function Row(props) {
    const { index } = props;
    const { row } = props;

    // Open and close modal
    const [open, setOpen] = useState(false);
    // SHow collapsible description
    const [showDescription, setShowDescription] = useState(false);

    const handleClose = () => setOpen(false);

    const handleClick = () => {
      setOpen(!open);
    };

    const handleShowDescription = () => {
      setShowDescription(!showDescription);
    };

    return (
      <Fragment>
        <TableRow
          key={row._id}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
          }}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() =>
                setShowDescription(
                  showDescription === row._id ? false : row._id,
                )
              }>
              {showDescription === row._id ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component='th' scope='row'>
            {index + 1}
          </TableCell>
          <TableCell align='left'>{row.category}</TableCell>
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
                  navigate(`/category/${row._id}`, { state: row })
                }>
                <PageviewIcon />
              </IconButton>

              <IconButton
                size='small'
                component='button'
                aria-label='edit'
                sx={{ color: 'secondary.main' }}
                onClick={() =>
                  navigate(`/category/edit/${row._id}`, {
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'>
            <Box sx={modalStyle}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
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
                    onClick={() => archiveCategory(row._id)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={showDescription === row._id}
              timeout='auto'
              unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size='small' aria-label='purchases'>
                  <TableBody>
                    <TableRow key={row._id}>
                      <TableCell
                        sx={{
                          maxWidth: '310px',
                          borderBottom: 'none',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          padding: 'none',
                        }}>
                        {row.description}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
  // end function creating table rows

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xl'>
        <Grid
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <h1>Category List</h1>
          <Box my={4}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/category/add')}>
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
                  // marginLeft='auto'
                  // maxWidth='50%'
                  src={Cherry}></Box>
              </Fade>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Zoom in={true} timeout={1000}>
                <TableContainer sx={{ maxWidth: 650 }}>
                  <Table
                    sx={{ width: 'max-content', mt: 4, mx: 'auto' }}
                    size='small'
                    aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>#</TableCell>
                        <TableCell align='left'>Category</TableCell>
                        <TableCell align='center'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories?.map((row, index) => (
                        <Row key={row._id} row={row} index={index} />
                      ))}
                    </TableBody>
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
              }}>
              <Fade in={true} timeout={2000}>
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
                        primary='Categories group events'
                        secondary='Think about the events and what categroies you might need. You will select the category when creating an event.'
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color='success' />
                      </ListItemIcon>
                      <ListItemText
                        primary='Categories represent actions'
                        secondary='Planting, weeding, sowing, fertilising, pruning, harvesting, spraying, etc.'
                      />
                    </ListItem>
                    ,
                  </List>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default Categories;
