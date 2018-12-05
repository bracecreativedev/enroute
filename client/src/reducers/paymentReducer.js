import { GET_PAYMENT, PAYMENT_LOADING } from '../actions/types';

const initialState = {
  payment: {},
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PAYMENT:
      return {
        ...state,
        payment: action.payload,
        loading: false
      };
    case PAYMENT_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
