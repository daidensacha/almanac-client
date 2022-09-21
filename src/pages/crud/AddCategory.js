import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AnimatedPage from '../../components/AnimatedPage';

const AddCategory = () => {
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
          <h1>Add Category Page</h1>
          <p>Coming soon...</p>
          <Button
            color='primary'
            variant='outlined'
            size='small'
            onClick={() => navigate(-1)}>
            <ArrowBackIos fontSize='small' />
            Back
          </Button>
        </Box>
      </Container>
    </AnimatedPage>
  )
}

export default AddCategory;