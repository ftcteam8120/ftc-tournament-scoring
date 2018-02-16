// Import react dependencies
import React from 'react';
import ReactDOM from 'react-dom';
// Declare the environment constants
declare const NODE_ENV: string;
declare const DEV: string;
declare const PROD: string;
// Import the hot loader container
import { AppContainer } from 'react-hot-loader';
// Import the root component
import { Root } from './components';
// Import the store and the history
import { configureStore } from './core/store';
import { configureClient } from './client';
// Configure the store
export const store = configureStore();
export const client = configureClient(store);

import { theme } from './theme';

// Define the root element for the application
const rootEl = document.getElementById('app');
// Check if the environment is production or development
if (NODE_ENV === DEV) {
  // Render function for the root component
  const render = (RootComponent) => {
    ReactDOM.render(
      // The provider element provides the store to all components
      <AppContainer>
        <RootComponent client={client} store={store} theme={theme} />
      </AppContainer>,
      rootEl
    );
  };
  // Trigger an initial render
  render(Root);
  // Check if hot reloading is enabled
  if ((module as any).hot) {
    // Only accept hot reloads for components
    (module as any).hot.accept('./components/index', () => {
      // Load the new component tree
      const NewRoot = require('./components/index').Root;
      // Render the component tree
      render(NewRoot);
    });
  }
} else {
  // Production render
  ReactDOM.render(
    <Root client={client} store={store} theme={theme} />,
    rootEl
  );
}
