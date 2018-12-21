import {
  ADMIN_GET_LOCATIONS,
  ADMIN_GET_LOCATION,
  ADMIN_GET_BOOKINGS,
  ADMIN_GET_USERS,
  ADMIN_GET_PAYMENTS
} from '../actions/types';

const initialState = {
  bookings: [],
  payments: [],
  locations: [],
  location: {},
  users: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADMIN_GET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    case ADMIN_GET_LOCATION:
      return {
        ...state,
        location: action.payload
      };
    case ADMIN_GET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload
      };
    case ADMIN_GET_PAYMENTS:
      return {
        ...state,
        payments: action.payload
      };
    case ADMIN_GET_USERS:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
}
