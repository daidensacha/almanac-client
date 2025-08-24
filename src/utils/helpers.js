import cookie from 'js-cookie';

// ---------------- Cookie helpers ----------------

// set cookie (usually for token)
export const setCookie = (key, value) => {
  if (typeof window !== 'undefined') {
    cookie.set(key, value, { expires: 1 }); // expires in 1 day
  }
};

// remove cookie
export const removeCookie = (key) => {
  if (typeof window !== 'undefined') {
    cookie.remove(key, { expires: 1 });
  }
};

// get cookie
export const getCookie = (key) => {
  if (typeof window !== 'undefined') {
    return cookie.get(key);
  }
};

// ---------------- LocalStorage helpers ----------------

export const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// ---------------- Auth helpers ----------------

// Clear everything (signout)
export const signout = (next) => {
  removeCookie('token');
  removeLocalStorage('user');
  try {
    localStorage.removeItem('token');
  } catch {}
  // notify the app that a logout happened
  window.dispatchEvent(new Event('auth:signedout'));
  next && next();
};

// Update user in localStorage (after profile update)
export const updateUser = (response, next) => {
  console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(response.data));
    window.dispatchEvent(new Event('auth:user-updated')); // notify listeners
  }
  if (next) next();
};

// Handy: get Authorization header for API calls
export const getAuthHeader = () => {
  const token = getCookie('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
