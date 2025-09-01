import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import AppLayout from '@/layouts/AppLayout';
import { ThemeProvider } from '@mui/material/';
import theme from '@/components/ui/theme';
import CssBaseline from '@mui/material/CssBaseline';
import AuthContextProvider from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toast.css';

const queryClient = new QueryClient();

const rootEl = document.getElementById('root');

createRoot(rootEl).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {/* <AppLayout> */}
          <App />
          {/* </AppLayout> */}
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  </QueryClientProvider>,
);
