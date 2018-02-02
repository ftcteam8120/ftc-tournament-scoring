import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { bindActionCreators, Action } from 'redux';
import { logout } from '../../core/actions';

import './index.less';

import { Input, Button } from '../form';

import TournamentsList from '../TournamentsList';

interface TournamentsProps {
  push: Function;
  logout: () => void;
}

interface TournamentsState {

}

class Tournaments extends Component<TournamentsProps, TournamentsState> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className="tournaments">
        <h1>My Tournaments</h1>
        <Button color="blue" onClick={() => this.props.logout()} label="Logout"/>
        <TournamentsList/>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    }
  };  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tournaments);
