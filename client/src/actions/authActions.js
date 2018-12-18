import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  PROCESS_COMPLETE,
  CLEAR_ERRORS,
  PASSWORD_CHANGE_COMPLETE,
  PASSWORD_CHANGE_ERROR,
  EMAIL_CHANGE_COMPLETE,
  EMAIL_CHANGE_ERROR,
  NAME_CHANGE_COMPLETE,
  NAME_CHANGE_ERROR,
  RESET_ACCOUNT_UPDATE
} from './types';

// Register User
export const registerUser = userData => dispatch => {
  axios
    .post('/api/auth/register', userData)
    .then(res => {
      dispatch({
        type: CLEAR_ERRORS
      });

      dispatch({
        type: PROCESS_COMPLETE
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/auth/login', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// change email address
export const updateEmail = newEmail => dispatch => {
  axios
    .post('/api/auth/update-email', newEmail)
    .then(res => {
      dispatch({
        type: CLEAR_ERRORS
      });
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));

      dispatch({
        type: EMAIL_CHANGE_COMPLETE
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      dispatch({
        type: EMAIL_CHANGE_ERROR
      });
    });
};

// update password
export const updatePassword = passwordData => dispatch => {
  axios
    .post('/api/auth/update-password', passwordData)
    .then(res => {
      // clear existing errors
      dispatch({
        type: CLEAR_ERRORS
      });

      dispatch({
        type: PASSWORD_CHANGE_COMPLETE
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      dispatch({
        type: PASSWORD_CHANGE_ERROR
      });
    });
};

// update name
export const updateName = nameData => dispatch => {
  axios
    .post('/api/auth/update-name', nameData)
    .then(res => {
      // clear existing errors
      dispatch({
        type: CLEAR_ERRORS
      });

      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));

      dispatch({
        type: NAME_CHANGE_COMPLETE
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      dispatch({
        type: NAME_CHANGE_ERROR
      });
    });
};

// reset account update info
export const resetAccountUpdate = () => dispatch => {
  dispatch({
    type: RESET_ACCOUNT_UPDATE
  });

  dispatch({
    type: CLEAR_ERRORS
  });
};
