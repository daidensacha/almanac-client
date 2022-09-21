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

const Plants = () => {
  const navigate = useNavigate();
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
          <h1>Plants Page</h1>
          <p>Coming soon...</p>
          <Box my={1}>
            <Stack direction='row' spacing={2}>
              <Fab
                size='small'
                color='primary'
                aria-label='add'
                onClick={() => navigate('/plants/add')}>
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
                onClick={() => navigate('/plants/edit')}>
                <EditIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  )
}

export default Plants;