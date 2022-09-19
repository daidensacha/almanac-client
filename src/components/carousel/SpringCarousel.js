import { useState, useEffect } from 'react';
import { animated, useTransition } from 'react-spring';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const images = [
  {
    name: 'Spring',
    text: 'Spring to Action! Plant, nourish, enjoy!',
  },
  {
    name: 'Summer',
    text: 'Tend to the gardens needs.',
  },
  {
    name: 'Autumn',
    text: 'Prepare for the dormant season.',
  },
  {
    name: 'Winter',
    text: 'Plan for the next seasons bounty.',
  },
];
export default function SpringCarousel() {
  const [pos, setPos] = useState(0);

  const transitions = useTransition(pos, {
    key: pos,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 3000 },
  });
  useEffect(() => {
    setInterval(() => {
      setPos(index => (index + 1) % images.length);
    }, 10000);
  }, []);

  return (
    <Box>
      {transitions((style, index) => (
        // <Container></Container>
        <Container
          component='animated.div'
          style={{
            ...style,
            // position: "absolute",
            display: 'flex',
            justifyContent: 'center',
            minWidth: '100vw',
            height: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            top: 0,
            left: 0,
            backgroundImage: `url(https://source.unsplash.com/1600x900/?${images[index].name})`,

            // backgroundImage: `url(https://images.unsplash.com/${images[index]}?w=1920&q=80&auto=format&fit=crop)`
          }}>
          <div
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              backgroundColor: 'rgba(255,0,0,0.3)',
              padding: '1.5rem',
              borderRadius: '.5rem',
              color: '#FED7C8',
              width: '320px',
            }}>
            <h1 style={{ textShadow: '2px 2px 6px #CE5937' }}>
              {images[index].name}
            </h1>
            <h3 style={{ textShadow: '2px 2px 6px #CE5937' }}>
              {images[index].text}
            </h3>
          </div>
        </Container>
      ))}
    </Box>
  );
}
