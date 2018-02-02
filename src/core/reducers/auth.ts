import {
  AUTH,
  AUTH_SUCCESS,
  AUTH_FAIL,
  NO_AUTH,
  LOGIN,
  LOGOUT
} from '../actions/auth';
// Define the types for the auth state
export interface AuthState {
  authenticated: boolean;
  loading: boolean;
  user: any;
  token: string;
  authError: string;
}
// Define the initial state for the reducer if no state is provided
export const initialState: AuthState = {
  authenticated: false,
  loading: true,
  user: null,
  token: null,
  authError: null
};

// Export the reducer function
export function auth(state: AuthState = initialState, action: any): AuthState {
  switch (action.type) {
    case LOGIN:
    case AUTH:
      return {
        ...state,
        loading: true
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        authenticated: true,
        user: action.user,
        token: action.token
      };
    case LOGOUT:
    case NO_AUTH:
    case AUTH_FAIL:
      return {
        ...state,
        loading: false,
        authenticated: false,
        user: null,
        token: null,
        authError: action.code
      };
    default:
      // Return the state if no action is not defined
      return state;
  }
}
