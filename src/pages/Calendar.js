import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AnimatedPage from '../components/AnimatedPage';

const Calendar = () => {
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
          <h1>Calendar Page</h1>
          <p>Coming soon...</p>
        </Box>
      </Container>
    </AnimatedPage>
  )
}

export default Calendar;