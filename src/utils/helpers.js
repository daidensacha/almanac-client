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

// Called on signin success
export const authenticate = (response, next) => {
  console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', response);
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
};

// Returns authenticated user object or false
export const isAuth = () => {
  if (typeof window !== 'undefined') {
    const cookieChecked = getCookie('token');
    if (cookieChecked && localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    }
  }
  return false;
};

// Clear everything
export const signout = (next) => {
  removeCookie('token');
  removeLocalStorage('user');
  next && next();
};

// Update user in localStorage (after profile update)
// export const updateUser = (response, next) => {
//   console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
//   if (typeof window !== 'undefined') {
//     let auth = JSON.parse(localStorage.getItem('user'));
//     auth = response.data;
//     localStorage.setItem('user', JSON.stringify(auth));
//   }
//   next();
// };

// utils/helpers.js
export const updateUser = (response, next) => {
  console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(response.data));
    window.dispatchEvent(new Event('auth:user-updated')); // <-- important
  }
  next();
};

// THIS IS THE STABLE FUNCTION

// export const updateUser = (response, next, setUser) => {
//   console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
//   if (typeof window !== 'undefined') {
//     const auth = response.data;
//     localStorage.setItem('user', JSON.stringify(auth));
//     if (setUser) setUser(auth); // update context state if provided
//   }
//   if (next) next();
// };

// Handy: get Authorization header for API calls
export const getAuthHeader = () => {
  const token = getCookie('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
