// Import redux and react-redux connector
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
// Import the reducers from redux
import { rootReducer } from './reducers';
// Declare the environment constants
declare const NODE_ENV: string;
declare const DEV: string;
// Create a reference to the window as any (TypeScript only)
const win = window as any;

let composeEnhancers;

if (NODE_ENV === DEV) {
  // Enhance the store with the redux devtools extension for Chrome
  composeEnhancers = composeWithDevTools;
} else {
  composeEnhancers = compose;
}

export const configureStore = (initialState?: any) => {
  // Add the reducer to your store on the `router` key
  // Also apply our middleware for navigating
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        ReduxThunk
      )
    )
  );

  return store;
};
