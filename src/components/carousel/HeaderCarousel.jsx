import Carousel from 'react-material-ui-carousel';
// import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './HeaderCarousel.css';
import { useUnsplashImage } from '@/utils/unsplash';

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
      height={'90vh'}
    >
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item(props) {
  const { url: bg } = useUnsplashImage(props.item.name, { fallbackUrl: null });
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        display: 'flex',
        bgcolor: 'primary.dark',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '90vh',

        // backgroundImage: `url(https://source.unsplash.com/1600x900/?${props.item.name})`,
        backgroundImage: bg ? `url(${bg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* rgba(255,0,0,0.5) */}
      <Box sx={{ p: 5, elevation: 30 }}>
        <CarouselText item={props.item} />
      </Box>
    </Box>
  );
}

function CarouselText({ item }) {
  return (
    <Box
      // sx={{ textShadow: '0px 0px 4px rgba(0,0,0,0.5)' }}
      sx={{
        bgcolor: 'rgba(0,0,0,0.4)',
        borderRadius: 2,
        px: { xs: 2, sm: 4 },
        py: { xs: 1, sm: 2 },
        display: 'inline-block',
      }}
    >
      <Typography
        variant="h1"
        component="div"
        color="common.white"
        sx={{
          textShadow: '0px 0px 4px rgba(0,0,0,0.8)',
          fontSize: {
            xs: '2.5rem', // ~40px on phones
            sm: '3.5rem', // ~56px on small tablets
            md: '5rem', // ~80px on desktops
          },
          fontWeight: 700,
        }}
        gutterBottom
      >
        {item.name}
      </Typography>

      <Typography
        variant="h4"
        component="div"
        color="common.white"
        sx={{
          textShadow: '0px 0px 4px rgba(0,0,0,0.6)',
          fontSize: {
            xs: '1.2rem', // ~19px on phones
            sm: '1.5rem', // ~24px
            md: '2rem', // ~32px
          },
          fontWeight: 400,
        }}
        gutterBottom
      >
        {item.description}
      </Typography>
    </Box>
  );
}
