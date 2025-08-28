// src/App.jsx
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import AppOutlet from '@/layouts/AppOutlet';
import ResponsiveAppBar from '@/components/ui/Navbar';
import { ToastContainer, cssTransition, Slide, Zoom } from 'react-toastify';
import { AppToasts } from '@/utils/toastConfig';

// public pages
import Home from '@/pages/Home';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import Contact from '@/pages/Contact';
import Forbidden from '@/pages/Forbidden';
import NotFound from '@/pages/NotFound';
import Faq from '@/pages/Faq';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';

// auth flows (public)
import ResetPassword from '@/pages/ResetPassword';
import ForgotPassword from '@/pages/ForgotPassword';
import Activate from '@/pages/Activate';

// private pages
import PrivateRoutes from '@/pages/PrivateRoutes';
import AdminRoute from '@/components/auth/AdminRoute'; // your admin gate
import Profile from '@/pages/Profile';
import Almanac from '@/pages/Almanac';
import HealthCheck from '@/pages/HealthCheck';
import OpenMeteoLab from '@/pages/admin/OpenMeteoLab';
import CalendarView from '@/pages/CalendarView';
import DayView from '@/pages/DayView';
import MonthView from '@/pages/MonthView';

// admin section
import AdminLayout from '@/layouts/AdminLayout'; // must render <Outlet/>
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAlmanac from '@/pages/admin/AdminAlmanac';
import AdminDev from '@/pages/admin/AdminDev';
import AdminLab from '@/pages/admin/AdminLab';
import Weather from '@/pages/admin/OpenMeteoLab';

// domain pages
import Events from '@/pages/Events';
import ViewEvent from '@/pages/crud/ViewEvent';
import AddEvent from '@/pages/crud/AddEvent';
import EditEvent from '@/pages/crud/EditEvent';
import Plants from '@/pages/Plants';
import ViewPlant from '@/pages/crud/ViewPlant';
import AddPlant from '@/pages/crud/AddPlant';
import EditPlant from '@/pages/crud/EditPlant';
import Categories from '@/pages/Categories';
import ViewCategory from '@/pages/crud/ViewCategory';
import AddCategory from '@/pages/crud/AddCategory';
import EditCategory from '@/pages/crud/EditCategory';

export default function App() {
  const location = useLocation();

  return (
    <>
      {/* <ResponsiveAppBar sx={{ bgcolor: 'primary.light' }} /> */}
      <AppToasts /> {/* ✅ global toasts */}
      {/* one global container */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Global layout: Navbar + Toast + Outlet */}
          <Route element={<AppOutlet />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="contact" element={<Contact />} />
            <Route path="forbidden" element={<Forbidden />} />
            <Route path="faq" element={<Faq />} />
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />

            {/* Token/Email flows (public) */}
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="activate-account/:token" element={<Activate />} />

            {/* Private */}
            <Route element={<PrivateRoutes />}>
              {/* General private */}
              {/* <Route path="health" element={<HealthCheck />} /> */}
              {/* <Route path="dev/openmeteo" element={<OpenMeteoLab />} /> */}
              <Route path="almanac" element={<CalendarView />}>
                <Route index element={<Almanac />} /> {/* Year grid = default */}
                <Route path="month" element={<MonthView />} />
                <Route path="day" element={<DayView />} />
              </Route>
              <Route path="profile" element={<Profile />} />
              <Route path="events" element={<Events />} />
              <Route path="event/:id" element={<ViewEvent />} />
              <Route path="event/add" element={<AddEvent />} />
              <Route path="event/edit/:id" element={<EditEvent />} />
              <Route path="plants" element={<Plants />} />
              <Route path="plant/:id" element={<ViewPlant />} />
              <Route path="plant/add" element={<AddPlant />} />
              <Route path="plant/edit/:id" element={<EditPlant />} />
              <Route path="categories" element={<Categories />} />
              <Route path="category/:id" element={<ViewCategory />} />
              <Route path="category/add" element={<AddCategory />} />
              <Route path="category/edit/:id" element={<EditCategory />} />
              {/* Admin (nested under private, extra gate) */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="almanac" element={<AdminAlmanac />} />
                  <Route path="dev" element={<AdminDev />} />
                  <Route path="lab" element={<AdminLab />} />
                  <Route path="weather" element={<Weather />} />
                </Route>
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        {/* <AppToasts /> ✅ global toasts */}
      </AnimatePresence>
    </>
  );
}
