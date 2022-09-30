import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/';
import theme from './components/ui/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import EventContextProvider from './contexts/EventsContext';

console.log(theme)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <EventContextProvider>
          <App />
        </EventContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  // </React.StrictMode>
);
