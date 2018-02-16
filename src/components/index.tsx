import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import App from './App';

export function Root({ store, client, theme }) {
  // Returns JSX just like a component, but in the form of a function
  return (
    // The Redux provider to give access to the stores
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <App/>
        </ApolloProvider>  
      </MuiThemeProvider>
    </Provider>
  );
};