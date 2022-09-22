import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ResponsiveAppBar from './components/ui/Navbar';

// import pages
import Home from './pages/Home';
import Almanac from './pages/Almanac';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import EditProfile from './pages/crud/EditProfile';
import Calendar from './pages/Calendar';
import Events from './pages/Events';
import AddEvent from './pages/crud/AddEvent';
import EditEvent from './pages/crud/EditEvent';
import Plants from './pages/Plants';
import AddPlant from './pages/crud/AddPlant';
import EditPlant from './pages/crud/EditPlant';
import Categories from './pages/Categories';
import AddCategory from './pages/crud/AddCategory';
import EditCategory from './pages/crud/EditCategory';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Activate from './pages/Activate';
import PrivateRoutes from './pages/PrivateRoutes';

// Note replaced exitBeforeEnter with mode="wait' in AnimatePresence

function App() {
  const location = useLocation();
  return (
    <div>
      <ResponsiveAppBar sx={{ bgcolor: 'primary.light' }} />
       <AnimatePresence mode='wait'>
        <Routes key={location.pathname} location={location}>
          <Route path='/' exact element={<Home />} />
          <Route path='signin' element={<Signin />} />
          <Route path='signup' element={<Signup />} />
          <Route path='contact' element={<Contact />} />
          {/* Private routes */}
          <Route element={<PrivateRoutes />}>
            <Route path='almanac' element={<Almanac />} />
            <Route path='profile' element={<Profile />} />
            <Route path='profile/edit' element={<EditProfile />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='events' element={<Events />} />
            <Route path='events/add' element={<AddEvent />} />
            <Route path='events/edit' element={<EditEvent />} />
            <Route path='plants' element={<Plants />} />
            <Route path='plants/add' element={<AddPlant />} />
            <Route path='plants/edit' element={<EditPlant />} />
            <Route path='categories' element={<Categories />} />
            <Route path='categories/add' element={<AddCategory />} />
            <Route path='categories/edit' element={<EditCategory />} />
          </Route>
          <Route path='reset-password' element={<ResetPassword />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='activate-account/:token' element={<Activate />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
