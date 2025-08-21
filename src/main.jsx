import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from '@mui/material/';
import theme from '@/components/ui/theme';
import CssBaseline from '@mui/material/CssBaseline';
import EventContextProvider from '@/contexts/EventsContext';
import PlantsContextProvider from '@/contexts/PlantsContext';
import CategoriesContextProvider from '@/contexts/CategoriesContext';
import AuthContextProvider from '@/contexts/AuthContext';

const rootEl = document.getElementById('root');

createRoot(rootEl).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthContextProvider>
        <EventContextProvider>
          <PlantsContextProvider>
            <CategoriesContextProvider>
              <App />
            </CategoriesContextProvider>
          </PlantsContextProvider>
        </EventContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </ThemeProvider>,
);
