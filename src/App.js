import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ResponsiveAppBar from './components/ui/Navbar';

// import pages
import Home from './pages/Home';
import Almanac from './pages/Almanac';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Events from './pages/Events';
import Plants from './pages/Plants';
import Categories from './pages/Categories';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';

// Note replaced exitBeforeEnter with mode="wait' in AnimatePresence

function App() {
  const location = useLocation();
  return (
    <div>
      <ResponsiveAppBar sx={{ bgcolor: 'primary.light' }} />
       <AnimatePresence mode='wait'>
        <Routes key={location.pathname} location={location}>
          <Route path='/' exact element={<Home />} />
          <Route path='almanac' element={<Almanac />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='contact' element={<Contact />} />
          <Route path='profile' element={<Profile />} />
          <Route path='calendar' element={<Calendar />} />
          <Route path='events' element={<Events />} />
          <Route path='plants' element={<Plants />} />
          <Route path='categories' element={<Categories />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          {/* <Route path='categories' element={<Categories />} /> */}
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
