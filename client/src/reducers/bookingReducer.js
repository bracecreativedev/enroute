import {
  SET_BOOKING_DATA,
  GET_BOOKINGS,
  GET_UPCOMING_BOOKINGS,
  GET_PAST_BOOKINGS,
  BOOKINGS_LOADING
} from '../actions/types';

const initialState = {
  bookings: [],
  pastBookings: [],
  upcomingBookings: [],
  bookingData: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BOOKING_DATA:
      return {
        ...state,
        bookingData: action.payload
      };
    case GET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload,
        loading: false
      };
    case GET_UPCOMING_BOOKINGS:
      return {
        ...state,
        upcomingBookings: action.payload,
        loading: false
      };
    case GET_PAST_BOOKINGS:
      return {
        ...state,
        pastBookings: action.payload,
        loading: false
      };
    case BOOKINGS_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
