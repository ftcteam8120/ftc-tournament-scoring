import {
  INITIAL_SYNC,
  INITIAL_SYNC_SUCCESS,
  SYNC_DATA,
  SYNC_DATA_SUCCESS,
  SYNC_DATA_ERROR,
  STOP_SYNC,
  SET_REFRESH_INTERVAL,
  SET_SCORING_SOFTWARE_URL,
  SET_EVENT_ID,
  INITIAL_SYNC_ERROR,
  SET_TIMEOUT
} from '../actions/sync';
// Define the types for the auth state
export interface SyncState {
  // initialized: boolean;
  event_id: string;
  scoring_software_url: string;
  syncing: boolean;
  teams: any[];
  matches: any[];
  rankings: any[];
  sync_error: any;
  last_sync: any;
  retries: number;
  refresh_interval: number;
  timeout: any;
}
// Define the initial state for the reducer if no state is provided
export const initialState: SyncState = {
  // initialized: false,
  event_id: '',
  scoring_software_url: 'http://localhost:8080/',
  syncing: false,
  teams: [],
  matches: [],
  rankings: [],
  sync_error: null,
  last_sync: null,
  retries: 0,
  refresh_interval: 30000,
  timeout: null
};

// Export the reducer function
export function sync(state: SyncState = initialState, action: any): SyncState {
  switch (action.type) {
    case SYNC_DATA:
      return {
        ...state,
        syncing: true
      };
    case STOP_SYNC:
      return {
        ...state,
        syncing: false
      };
    /*case INITIAL_SYNC:
      return {
        ...state,
        syncing: true
      };
    case INITIAL_SYNC_SUCCESS:
      return {
        ...state,
        initialized: true,
        syncing: false,
        retries: 0,
        teams: action.teams,
        matches: action.matches
      };
    case INITIAL_SYNC_ERROR:
      return {
        ...state,
        syncing: false,
        sync_error: action.error
      };*/
    case SYNC_DATA_SUCCESS:
      return {
        ...state,
        retries: 0,
        rankings: action.rankings,
        matches: action.matches,
        last_sync: Date.now()
      };
    case SYNC_DATA_ERROR:
      return {
        ...state,
        sync_error: action.error,
        retries: state.retries += 1
      };
    case SET_REFRESH_INTERVAL:
      return {
        ...state,
        refresh_interval: action.interval
      };
    case SET_SCORING_SOFTWARE_URL:
      return {
        ...state,
        scoring_software_url: action.url
      };
    case SET_EVENT_ID:
      return {
        ...state,
        event_id: action.id
      };
    case SET_TIMEOUT:
      return {
        ...state,
        timeout: action.timeout
      };
    default:
      // Return the state if no action is not defined
      return state;
  }
}
