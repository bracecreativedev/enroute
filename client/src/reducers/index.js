import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import locationReducer from './locationReducer';

// combine all reducers
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  locations: locationReducer
});
