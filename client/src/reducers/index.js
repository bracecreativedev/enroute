import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import locationReducer from './locationReducer';
import bookingReducer from './bookingReducer';
import paymentReducer from './paymentReducer';
import adminReducer from './adminReducer';

// combine all reducers
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  locations: locationReducer,
  bookings: bookingReducer,
  payments: paymentReducer,
  admin: adminReducer
});
