import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

// combine all reducers
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
