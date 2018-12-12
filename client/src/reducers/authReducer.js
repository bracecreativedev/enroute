import isEmpty from '../validation/is-empty';

import { SET_CURRENT_USER, PROCESS_COMPLETE } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  registrationComplete: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROCESS_COMPLETE:
      return {
        ...state,
        registrationComplete: true
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
