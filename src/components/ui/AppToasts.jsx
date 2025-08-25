// src/components/ui/AppToasts.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppToasts() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={10000} // 👈 controls lifetime globally
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable={false}
      newestOnTop
      theme="dark"
    />
  );
}
