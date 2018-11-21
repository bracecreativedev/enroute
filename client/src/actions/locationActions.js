import axios from 'axios';

import {
  GET_ERRORS,
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
export const setFeaturedLocation = location => dispatch => {
  // TODO
  dispatch({
    type: SET_FEATURED_LOCATION,
    payload: location
  });
};

// locations loading
export const setLocationLoading = () => {
  return {
    type: LOCATIONS_LOADING
  };
};
