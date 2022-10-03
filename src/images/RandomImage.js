import Berries from '../images/berries.jpg';
import Broccoli from './broccoli_floret.jpg';
import Ghurkins from '../images/ghurkins.jpg';
import Cherries from '../images/cherries.jpg';
import Pumpkins from './pumpkins.jpg';

const RandomImage = () => {
  const images = [Berries, Broccoli, Ghurkins, Cherries, Pumpkins];
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
