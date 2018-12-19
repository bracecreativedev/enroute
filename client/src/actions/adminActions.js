import axios from 'axios';
import isEmpty from '../validation/is-empty';

// import types
import {
  ADMIN_GET_LOCATIONS,
  ADMIN_GET_BOOKINGS,
  ADMIN_GET_USERS,
  ADMIN_GET_LOCATION
} from './types';

// get locations
export const adminGetLocations = () => dispatch => {
  axios.get('/api/admin/locations').then(res => {
    dispatch({
      type: ADMIN_GET_LOCATIONS,
      payload: res.data
    });
  });
};

// get single location
export const adminGetLocation = id => dispatch => {
  axios.get(`/api/admin/location/${id}`).then(res => {
    dispatch({
      type: ADMIN_GET_LOCATION,
      payload: res.data
    });
  });
};

export const adminEditLocation = (id, locationData) => dispatch => {
  axios.post(`/api/admin/location/${id}`, locationData).then(res => {
    dispatch({
      type: ADMIN_GET_LOCATION,
      payload: res.data
    });
  });
};

// get bookings
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

// get users
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
