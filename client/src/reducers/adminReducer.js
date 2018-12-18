import isEmpty from '../validation/is-empty';

import {
  ADMIN_GET_LOCATIONS,
  ADMIN_GET_BOOKINGS,
  ADMIN_GET_USERS
} from '../actions/types';

const initialState = {
  bookings: [],
  locations: [],
  users: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADMIN_GET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    case ADMIN_GET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload
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
