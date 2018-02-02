// Import react dependencies
import React from 'react';
import ReactDOM from 'react-dom';
// Declare the environment constants
declare const NODE_ENV: string;
declare const DEV: string;
declare const PROD: string;
// Import the root component
import { Root } from './components';
// Import the store and the history
import { configureStore, history } from './core/store';
import { configureClient } from './client';
// Configure the store
export const store = configureStore();
export const client = configureClient(store);

import { auth, login } from './core/actions/auth';

ReactDOM.render(
  <Root history={history} client={client} store={store} />,
  document.getElementById('app')
);
