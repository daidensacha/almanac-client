import HeaderCarousel from '../components/carousel/HeaderCarousel';
// import SpringCarousel from '../components/carousel/SpringCarousel';
import AlmanacCards from '../components/CardSection';
import ClimateSection from '../components/ClimateSection';
import TriviaSection from '../components/TriviaSection';
import AboutSection from '../components/AboutSection';
import InterestedSection from '../components/InterestedSection';
import AnimatedPage from '../components/AnimatedPage';

const Home = () => {
  return (
    <AnimatedPage>
      <HeaderCarousel />
      {/* <SpringCarousel /> */}
      <AlmanacCards />
      <ClimateSection />
      <TriviaSection />
      <AboutSection />
      <InterestedSection />
    </AnimatedPage>
  )
}

export default Home;