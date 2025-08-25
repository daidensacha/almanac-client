// src/utils/toastConfig.jsx
/**
 * Toast Config
 *
 * Usage:
 *   1. Import the container once in App.jsx (near the root):
 *        import { AppToasts, notify } from '@/utils/toastConfig';
 *        ...
 *        <AppToasts />
 *
 *   2. Trigger toasts anywhere:
 *        notify.success("Saved!");
 *        notify.error("Failed to save");
 *        notify.info("Heads up…");
 *        notify.warn("Careful!");
 *
 *   3. Override duration or options per-toast:
 *        notify.success("Quick!", { autoClose: 1200 });   // faster
 *        notify.error("Wait here!", { autoClose: 6000 }); // linger longer
 *
 *   4. Defaults (autoClose=2000, fade in=600ms, fade out=400ms)
 *      are tuned for a ~1s "hang time" on screen.
 *
 *   Notes:
 *   - Colors/stripes styled in src/styles/toast.css
 *   - Transition: Gentle fade in/out with slight lift
 *   - Errors default to longer (4000ms) since they’re critical
 */

import { toast, ToastContainer, cssTransition } from 'react-toastify';
import '@/styles/toast.css';
import 'react-toastify/dist/ReactToastify.css';

// Gentle fade in/out with lift
const Gentle = cssTransition({
  enter: 'toast-fade-in',
  exit: 'toast-fade-out',
  duration: [600, 400],
  collapse: true,
});

export const toastDefaults = {
  position: 'top-right',
  autoClose: 2000, // ~2s total by default
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  draggable: true,
  theme: 'light',
  transition: Gentle,
  className: 'toastify--subtle',
  bodyClassName: 'toastify__body',
  progressClassName: 'toastify__progress',
};

// One container, app-wide
export function AppToasts(props) {
  return <ToastContainer {...toastDefaults} {...props} />;
}

// Call these in your pages/components
export const notify = {
  success: (msg, opts) => toast.success(msg, { ...toastDefaults, ...opts }),
  info: (msg, opts) => toast.info(msg, { ...toastDefaults, ...opts }),
  warn: (msg, opts) => toast.warn(msg, { ...toastDefaults, ...opts }),
  error: (msg, opts) => toast.error(msg, { ...toastDefaults, autoClose: 4000, ...opts }), // errors linger longer
};
