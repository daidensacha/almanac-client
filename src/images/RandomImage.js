import Berries from './mockup-graphics-mw233LhCbQ8-unsplash.jpg';
import Broccoli from './mockup-graphics-q7BJL1qZ1Bw-unsplash.jpg';
import Gherkins from './mockup-graphics-UrLT3x0x9sA-unsplash.jpg';
import Cherries from './quaritsch-photography--5FRm3GHdrU-unsplash.jpg';
import Pumpkins from './tijana-drndarski-pZjTMVTGjlc-unsplash.jpg';

const RandomImage = () => {
  const images = [Berries, Broccoli, Gherkins, Cherries, Pumpkins];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return randomImage;
};

export default RandomImage;

// export const ImagesArray = [
//   {
//     id: 1,
//     name: 'Berries',
//     image: Berries
//   },
//   {
//     id: 2,
//     name: 'Broccoli',
//     image: Broccoli
//   },
//   {
//     id: 3,
//     name: 'Gerkhins',
//     image: Gherkins
//   },
//   {
//     id: 4,
//     name: 'Cherries',
//     image: Cherries
//   },
//   {
//     id: 5,
//     name: 'Pumpkins',
//     image: Pumpkins
//   }
// ]
