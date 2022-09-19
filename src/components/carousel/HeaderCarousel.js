import Carousel from 'react-material-ui-carousel';
// import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './HeaderCarousel.css';

export default function HeaderCarousel(props) {
  var items = [
    {
      name: 'Spring',
      description: 'Spring to Action! Plant, nourish, enjoy!',
    },
    {
      name: 'Summer',
      description: 'Tend to the gardens needs.',
    },
    {
      name: 'Autumn',
      description: 'Prepare for the dormant season.',
    },
    {
      name: 'Winter',
      description: 'Plan for the next seasons bounty.',
    },
  ];

  return (
    <Carousel
      sx={{ backgroundColor: 'primary.dark' }}
      className={'imageCarousel'}
      autoPlay={true}
      indicatorContainerProps={{
        className: 'indicatorContainer',
        style: { marginBottom: '20px' },
      }}
      animation={'fade'}
      fullHeightHover={true}
      interval={20000}
      duration={4000}
      swipe={true}
      height={'90vh'}>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item(props) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        display: 'flex',
        bgcolor: 'primary.dark',
        // bgcolor: '#000000',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '90vh',
        backgroundImage: `url(https://source.unsplash.com/1600x900/?${props.item.name})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      {/* rgba(255,0,0,0.5) */}
      <Box sx={{ p: 5, elevation: 30 }}>
        <CarouselText item={props.item} />
      </Box>
    </Box>
  );
}

function CarouselText(props) {
  return (
    <Box sx={{ textShadow: '0px 0px 4px primary.light'}}>
      <Typography
        variant='h1'
        component='div'
        color='text.light'
        sx={{ textShadow: '0px 0px 4px #fff' }}
        gutterBottom>
        {props.item.name}
      </Typography>
      <Typography
        variant='h4'
        component='div'
        color='text.primary'
        sx={{ textShadow: '0px 0px 4px #fff'  }}
        gutterBottom>
        {props.item.description}
      </Typography>
    </Box>
  );
}
