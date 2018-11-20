import { GET_LOCATIONS, LOCATIONS_LOADING } from '../actions/types';

const initialState = {
  locations: [],
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
    default:
      return state;
  }
}
