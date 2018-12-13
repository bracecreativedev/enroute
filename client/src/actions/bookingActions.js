import axios from 'axios';

import {
  GET_ERRORS,
  SET_BOOKING_DATA,
  GET_BOOKINGS,
  GET_UPCOMING_BOOKINGS,
  GET_PAST_BOOKINGS,
  BOOKINGS_LOADING
} from './types';

// create a new booking
export const createBooking = bookingData => dispatch => {
  axios
    .post('/api/bookings', bookingData)
    .then(res => console.log('success'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set booking data
export const setBookingData = data => dispatch => {
  dispatch({
    type: SET_BOOKING_DATA,
    payload: data
  });
};

// get users bookings
export const getBookings = page => dispatch => {
  dispatch(setBookingsLoading());

  axios
    .get(`/api/bookings?page=${page}`)
    .then(res =>
      dispatch({
        type: GET_BOOKINGS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_BOOKINGS,
        payload: []
      })
    );
};

// get upcoming bookings
export const getUpcomingBookings = page => dispatch => {
  dispatch(setBookingsLoading());

  axios
    .get(`/api/bookings/upcoming?page=${page}`)
    .then(res =>
      dispatch({
        type: GET_UPCOMING_BOOKINGS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_UPCOMING_BOOKINGS,
        payload: []
      })
    );
};

// get past bookings
export const getPastBookings = page => dispatch => {
  dispatch(setBookingsLoading());

  axios
    .get(`/api/bookings/past?page=${page}`)
    .then(res => {
      dispatch({
        type: GET_PAST_BOOKINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PAST_BOOKINGS,
        payload: []
      })
    );
};

// bookings loading
export const setBookingsLoading = () => {
  return {
    type: BOOKINGS_LOADING
  };
};
