import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Action } from 'redux';
import { auth } from '../../core';

import './index.less';

interface LoadingScreenProps {
  loading: boolean;
  auth: () => Action;
}

interface LoadingScreenState { }

class LoadingScreen extends Component<LoadingScreenProps, LoadingScreenState> {
  
  // Wait until the component mounts to avoid issues later
  public componentDidMount() {
    // Check the authentication with the server
    this.props.auth();
  }

  public render() {
    // Only show the router if the auth has loaded
    let children;
    if (!this.props.loading) {
      return <div>{this.props.children}</div>;
    } else {
      return (
        <div className="loading-screen">
          <img className="loading-logo" src="/img/loading.svg"/>
        </div>
      );
    }
  }

}

const mapStateToProps = (state) => ({
  loading: state.auth.loading
});

const mapDispatchToProps = (dispatch) => {
  return {
    auth: () => {
      dispatch(auth());
    }
  };  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingScreen);
