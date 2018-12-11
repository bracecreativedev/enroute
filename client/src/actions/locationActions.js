import axios from 'axios';

import {
  GET_LOCATIONS,
  LOCATIONS_LOADING,
  SET_FEATURED_LOCATION
} from './types';

// get locations
export const getLocations = () => dispatch => {
  dispatch(setLocationLoading());

  axios
    .get('/api/locations')
    .then(res =>
      dispatch({
        type: GET_LOCATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_LOCATIONS,
        payload: {}
      })
    );
};

// set featured location
export const setFeaturedLocation = (location, isAuthenticated) => dispatch => {
  dispatch(setLocationLoading());

  if (location) {
    axios.get(`/api/bookings/availability/${location._id}`).then(res => {
      if (isAuthenticated) {
        axios.get(`/api/bookings/user/availability`).then(alreadyBooked => {
          dispatch({
            type: SET_FEATURED_LOCATION,
            payload: {
              location,
              disabledDays: res.data.unavailable,
              alreadyBooked: alreadyBooked.data.unavailable
            }
          });
        });
      } else {
        dispatch({
          type: SET_FEATURED_LOCATION,
          payload: {
            location,
            disabledDays: res.data.unavailable
          }
        });
      }
    });
  } else {
    dispatch({
      type: SET_FEATURED_LOCATION,
      payload: {}
    });
  }
};

// locations loading
export const setLocationLoading = () => {
  return {
    type: LOCATIONS_LOADING
  };
};
