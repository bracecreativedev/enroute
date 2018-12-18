import isEmpty from '../validation/is-empty';

import {
  SET_CURRENT_USER,
  PROCESS_COMPLETE,
  PASSWORD_CHANGE_COMPLETE,
  PASSWORD_CHANGE_ERROR,
  EMAIL_CHANGE_COMPLETE,
  EMAIL_CHANGE_ERROR,
  NAME_CHANGE_COMPLETE,
  NAME_CHANGE_ERROR,
  RESET_ACCOUNT_UPDATE
} from '../actions/types';

const initialState = {
  isAuthenticated: false,
  registrationComplete: false,
  user: {},
  accountUpdate: {
    passwordChanged: false,
    emailChanged: false,
    nameChanged: false
  }
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
    case RESET_ACCOUNT_UPDATE:
      return {
        ...state,
        accountUpdate: {
          passwordChanged: false,
          emailChanged: false,
          nameChanged: false
        }
      };
    case PASSWORD_CHANGE_COMPLETE:
      return {
        ...state,
        accountUpdate: { passwordChanged: true }
      };
    case PASSWORD_CHANGE_ERROR:
      return {
        ...state,
        accountUpdate: { passwordChanged: false }
      };
    case EMAIL_CHANGE_COMPLETE:
      return {
        ...state,
        accountUpdate: { emailChanged: true }
      };
    case EMAIL_CHANGE_ERROR:
      return {
        ...state,
        accountUpdate: { emailChanged: false }
      };
    case NAME_CHANGE_COMPLETE:
      return {
        ...state,
        accountUpdate: { nameChanged: true }
      };
    case NAME_CHANGE_ERROR:
      return {
        ...state,
        accountUpdate: { nameChanged: false }
      };
    default:
      return state;
  }
}
