// Import the base Component class from React
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// Import the connector to connect React and Redux
import { connect } from 'react-redux';
import { bindActionCreators, Action } from 'redux';
// Import the root state types and actions from the core folder

// Import the stylesheet for this component
import './index.less';

// Define the property types
interface AppProps {
  authenticated: boolean;
}

// Define the state types
interface AppState {}

class App extends Component<AppProps, AppState> {

  // The render function will render the component
  public render() {
    // Check if the user is authenticated
    if (this.props.authenticated) {
      // If they are, proceed like normal
      return (
        <div className="app">
          {this.props.children}
        </div>
      );
    } else {
      // Otherwise, return a redirect component to redirect to login
      return <Redirect to="/login" />;
    }
  }

}

// Function to map the state of the object to the component props
const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated
});

// Function to map the dispatch functions to the component props
const mapDispatchToProps = (dispatch) => {
  return {};  
};

// Export the final connected class
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
