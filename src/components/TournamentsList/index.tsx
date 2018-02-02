import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { push } from 'react-router-redux';

import TournamentItem from './TournamentItem';

import './index.less';

interface TournamentsListProps {
  currentUserId: string;
  data: any;
  events: any[];
}

interface TournamentsListState {

}

class TournamentsList extends Component<TournamentsListProps, TournamentsListState> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { errors, loading, findEventsForAdmin: events } = this.props.data;
    if (!loading) {
      return (
        <div className="tournaments-list">
          {events.map((event) => (
            <TournamentItem
              id={event.id}
              name={event.name}
              key={event.id}
            />
          ))}
        </div>
      );
    } else {
      return <div>loading</div>;
    }
  }

}

const mapStateToProps = (state) => ({
  currentUserId: state.auth.user._id
});

const mapDispatchToProps = (dispatch) => {
  return {};  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(graphql<any, any>(gql`
  query EventsForAdmin($admin: String!) {
    findEventsForAdmin(admin: $admin) {
      id
      shortid
      name
    }
  }
`,
{
  options: (props: TournamentsListProps) => ({
    variables: {
      admin: props.currentUserId
    }
  })
})(TournamentsList));