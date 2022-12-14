import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/';
import theme from './components/ui/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import EventContextProvider from './contexts/EventsContext';
import PlantsContextProvider from './contexts/PlantsContext';
import CategoriesContextProvider from './contexts/CategoriesContext';
import AuthContextProvider from './contexts/AuthContext';

console.log(theme);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
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
  // </React.StrictMode>
);
