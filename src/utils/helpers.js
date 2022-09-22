import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();

import cookie from 'js-cookie';

// set cookie
export const setCookie = (key, value) => {
  if (window !== 'undefined') {
    cookie.set(key, value, {
      expires: 1
    });
  }
}

// remove cookie
export const removeCookie = (key) => {
  if (window !== 'undefined') {
    cookie.remove(key, {
      expires: 1
    });
  }
}

// get from cookie such as stored token
// useful to make request to server with token
export const getCookie = (key) => {
  if (window !== 'undefined') {
    return cookie.get(key);
  }
}

// set in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// remove from localstorage
export const removeLocalStorage = (key) => {
  if (window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// set authenticated user data to cookie and localstorage during signin
export const authenticate = (response, next) => {
  console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', response);
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
}

// GET- access authenticated user info from localstorage
export const isAuth = () => {
  if (window !== 'undefined') {
    // get and check cookie
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      // get user from localstorage if cookie is valid
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
}

// signout
export const signout = (next) => {
  removeCookie('token');
  removeLocalStorage('user');
  // next();
}

// update user in localstorage
export const updateUser = (response, next) => {
  console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
  if (typeof window !== 'undefined') {
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user', JSON.stringify(auth));
  }
  next();
}
