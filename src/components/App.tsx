import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Main from './Main';
import Login from './Login';

interface Props {
  authenticated: boolean;
}

class App extends Component<Props> {
  render() {
    return (
      <Fragment>
        {this.props.authenticated ? (
          <Main/>
        ) : (
          <Login/>  
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated
});

// Function to map the dispatch functions to the component props
const mapDispatchToProps = (dispatch) => {
  return {
    
  };  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);