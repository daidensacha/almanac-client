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
import EventCalendar from './pages/EventCalendar';
import Events from './pages/Events';
import AddEvent from './pages/crud/AddEvent';
import EditEvent from './pages/crud/EditEvent';
import ViewEvent from './pages/crud/ViewEvent';
import Plants from './pages/Plants';
import AddPlant from './pages/crud/AddPlant';
import EditPlant from './pages/crud/EditPlant';
import ViewPlant from './pages/crud/ViewPlant';
import Categories from './pages/Categories';
import AddCategory from './pages/crud/AddCategory';
import EditCategory from './pages/crud/EditCategory';
import ViewCategory from './pages/crud/ViewCategory';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Activate from './pages/Activate';
import PrivateRoutes from './pages/PrivateRoutes';
import AuthContextProvider from './contexts/AuthContext';
import { useEventsContext }  from './contexts/EventsContext';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

// Note replaced exitBeforeEnter with mode="wait' in AnimatePresence

function App() {


  console.log(useEventsContext())
  const location = useLocation();
  return (
    <div>
      <AuthContextProvider>
        <ResponsiveAppBar sx={{ bgcolor: 'primary.light' }} />
        <ToastContainer />
        <AnimatePresence mode='wait'>
          <Routes key={location.pathname} location={location}>
            <Route path='/' end element={<Home />} />
            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />
            <Route path='contact' element={<Contact />} />
            {/* Private routes */}
            <Route element={<PrivateRoutes />}>
              <Route path='almanac' element={<Almanac />} />
              <Route path='profile' element={<Profile />} />
              <Route path='profile/edit' element={<EditProfile />} />
              <Route path='calendar' element={<EventCalendar />} />
              <Route path='events' element={<Events />} />
              <Route path='event/:id' element={<ViewEvent />} />
              <Route path='event/add' element={<AddEvent />} />
              <Route path='event/edit/:id' element={<EditEvent />} />
              <Route path='plants' element={<Plants />} />
              <Route path='plant/:id' element={<ViewPlant />} />
              <Route path='plant/add' element={<AddPlant />} />
              <Route path='plant/edit/:id' element={<EditPlant />} />
              <Route path='categories' element={<Categories />} />
              <Route path='category/:id' element={<ViewCategory />} />
              <Route path='category/add' element={<AddCategory />} />
              <Route path='category/edit/:id' element={<EditCategory />} />
            </Route>
            <Route path='reset-password' element={<ResetPassword />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='activate-account/:token' element={<Activate />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </AuthContextProvider>
    </div>
  );
}

export default App;
