// Import the Action type (TypeScript only)
import { Action } from 'redux';
import { fidoAuth } from '../../utils/fido';
import { ThunkAction } from 'redux-thunk';
// Define the action constants
export const AUTH = 'AUTH';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const NO_AUTH = 'NO_AUTH';
export const AUTH_FAIL = 'AUTH_FAIL';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export enum AuthError {
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  NOT_FOUND = 'NOT_FOUND'
}

// Trigger this action on auth success
export function authSuccess(user: any, token: string): any {
  return {
    type: AUTH_SUCCESS,
    user,
    token
  };
}

// Trigger this action on auth failure
export function authFail(code: AuthError): Action & { code: AuthError } {
  return {
    type: AUTH_FAIL,
    code
  };
}

// Trigger this action if ther user is not authenticated
export function noAuth(): Action {
  return {
    type: NO_AUTH
  };
}

// Attempt to check the user's authentication status
/*
This is a redux-thunk function, meaning that it returns
a function that later dispatches other actions
*/
export function auth(): any {
  return function (dispatch) {
    // Dispatch the initial auth action (sets loading to true)
    dispatch({ type: AUTH });
    // Fetch the base auth URL to check auth status
    return fidoAuth('', { method: 'GET' }, false).then((raw: any) => {
      if (raw.authenticated) {
        // User is already authenticated
        dispatch(authSuccess(raw.data, window.localStorage.token));
      } else {
        // User is not authenticated
        dispatch(noAuth());
      }
    }).catch((err) => {
      dispatch(authFail(err));
    });
  }
}

// Login using a standard username and password
export function login(username: string, password: string): any {
  return function (dispatch) {
    // Dispatch the initial login action (sets loading to true)
    dispatch({ type: LOGIN });
    // Attempt to authenticate the user
    return fidoAuth('login', {
      method: 'post',
      body: {
        username,
        password
      }
    }, false /* Do not extract the data */).then((raw: any) => {
      // Set the token in the localStorage
      window.localStorage.token = raw.token;
      // Dispatch a success action
      dispatch(authSuccess(raw.data, raw.token));
    }).catch((err) => {
      dispatch(authFail(err));
    });
  }
}

// Logout the user
export function logout(): Action {
  // Clear the localStorage
  window.localStorage.token = null;
  return {
    type: LOGOUT
  };
}

// Export the action object
export let authActions = {
  login,
  logout,
  authSuccess,
  authFail,
  noAuth,
  auth
};
