import React from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';

// Export all of the components
export * from './App';

// Import all of the components
import App from './App';
import LoadingScreen from './LoadingScreen';
import Login from './Login';
import Tournaments from './Tournaments';
import Tournament from './Tournament';

/*
 The primary root element of the app
 This element is reloaded when the hot loader detects
 changes in this file or any of it's dependencies
*/
export function Root({ store, client, history }) {
  // Returns JSX just like a component, but in the form of a function
  return (
    // The Redux provider to give access to the stores
    <Provider store={store}>
      <ApolloProvider client={client}>
        <LoadingScreen>
          {/* ConnectedRouter will use the store from Provider automatically */}
          <ConnectedRouter history={history}>
            <HashRouter>
              {/* The switch workjs just like a switch in javascript */}  
              <Switch>
                {/* We keep this outside the App component because unauthed users should be here */}  
                <Route exact path="/login" component={Login} />  
                {/* All app paths that require authentication go inside the app component */}
                <App>
                  <Route exact path="/" component={Tournaments}/>
                  <Route path="/event/:id" component={Tournament}>
                  </Route>  
                </App>  
              </Switch>
            </HashRouter>  
          </ConnectedRouter>
        </LoadingScreen>
      </ApolloProvider>  
    </Provider>
  );
};
