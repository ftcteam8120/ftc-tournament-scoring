// Import redux and react-redux connector
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
// Import requirements for react-router-redux
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';
import { composeWithDevTools } from 'remote-redux-devtools';
// Import the reducers from redux
import { rootReducer } from './reducers';
// Declare the environment constants
declare const NODE_ENV: string;
declare const DEV: string;

// Import browser history and react-router
import createHistory from 'history/createBrowserHistory';
// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();
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
        routerMiddleware(history),
        ReduxThunk
      )
    )
  );

  return store;
};
