import axios from 'axios';

import { GET_PAYMENT, PAYMENT_LOADING } from './types';

// get a payment
export const getPayment = paymentID => dispatch => {
  dispatch(setPaymentLoading());

  axios
    .get(`/api/payments/${paymentID}`)
    .then(res => {
      console.log(res);

      dispatch({
        type: GET_PAYMENT,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_PAYMENT,
        payload: {}
      });
    });
};

// payment loading
export const setPaymentLoading = () => {
  return {
    type: PAYMENT_LOADING
  };
};
