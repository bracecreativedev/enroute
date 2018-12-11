import axios from 'axios';

import { GET_PAYMENT, GET_PAYMENTS, PAYMENT_LOADING } from './types';

// get a payment
export const getPayment = paymentID => dispatch => {
  dispatch(setPaymentLoading());

  axios
    .get(`/api/payments/${paymentID}`)
    .then(res => {
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

// get all users payments
export const getAllPayments = () => dispatch => {
  dispatch(setPaymentLoading());

  axios
    .get('/api/payments')
    .then(res => {
      dispatch({
        type: GET_PAYMENTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        typE: GET_PAYMENTS,
        payload: []
      });
    });
};

// payment loading
export const setPaymentLoading = () => {
  return {
    type: PAYMENT_LOADING
  };
};
