import { GET_PAYMENT, PAYMENT_LOADING, GET_PAYMENTS } from '../actions/types';

const initialState = {
  payment: {},
  payments: [],
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
    case GET_PAYMENTS:
      return {
        ...state,
        payments: action.payload,
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
