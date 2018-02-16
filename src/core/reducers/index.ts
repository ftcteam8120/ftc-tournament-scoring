// Import the reducer combiner from redux
import { combineReducers } from 'redux';
import { apolloReducer } from 'apollo-cache-redux';

// Import all of the separate reducers below
import { auth } from './auth';
import { sync } from './sync';

const reducers = {
  auth,
  sync
};
// Export the combined reducers
export const rootReducer = combineReducers({
  ...reducers,
  apollo: apolloReducer
});