import {
  SET_BOOKING_DATA,
  GET_BOOKINGS,
  BOOKINGS_LOADING
} from '../actions/types';

const initialState = {
  bookings: [],
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
    case BOOKINGS_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    default:
      return state;
  }
}
