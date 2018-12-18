import axios from 'axios';
import isEmpty from '../validation/is-empty';

// import types
import {
  ADMIN_GET_LOCATIONS,
  ADMIN_GET_BOOKINGS,
  ADMIN_GET_USERS
} from './types';

export const adminGetLocations = () => dispatch => {
  axios.get('/api/admin/locations').then(res => {
    dispatch({
      type: ADMIN_GET_LOCATIONS,
      payload: res.data
    });
  });
};

export const adminGetBookings = queries => dispatch => {
  axios
    .get(
      `/api/admin/bookings?location=${queries.location}&bookingDates=${
        queries.bookingDates
      }&user=${queries.user}`
    )
    .then(res => {
      dispatch({
        type: ADMIN_GET_BOOKINGS,
        payload: res.data
      });
    })
    .catch(
      dispatch({
        type: ADMIN_GET_BOOKINGS,
        payload: []
      })
    );
};

export const adminGetUsers = queries => dispatch => {
  if (isEmpty(queries)) {
    axios
      .get('/api/admin/users')
      .then(res => {
        dispatch({
          type: ADMIN_GET_USERS,
          payload: res.data
        });
      })
      .catch(err => {
        dispatch({
          type: ADMIN_GET_USERS,
          payload: []
        });
      });
  } else {
    axios
      .get(
        `/api/admin/users?name=${queries.name}&email=${queries.email}&id=${
          queries.id
        }`
      )
      .then(res => {
        dispatch({
          type: ADMIN_GET_USERS,
          payload: res.data
        });
      })
      .catch(err => {
        dispatch({
          type: ADMIN_GET_USERS,
          payload: []
        });
      });
  }
};
