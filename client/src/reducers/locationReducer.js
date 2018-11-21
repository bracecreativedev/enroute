import {
  GET_LOCATIONS,
  LOCATIONS_LOADING,
  SET_FEATURED_LOCATION
} from '../actions/types';

const initialState = {
  locations: [],
  featuredLocation: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOCATIONS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
        loading: true
      };
    case SET_FEATURED_LOCATION:
      return {
        ...state,
        featuredLocation: action.payload
      };
    default:
      return state;
  }
}
