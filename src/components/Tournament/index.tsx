import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { bindActionCreators, Action } from 'redux';
import JsonTable from 'ts-react-json-table';
import { setEventId, initialSync, setScoringSoftwareUrl, sync, stopSync, setRefreshInterval } from '../../core/actions';

import { Button, Input } from '../form';

import './index.less';

interface TournamentProps {
  match: {
    params: {
      id: string;
    }
  }
  data: any;
  url: string;
  syncing: boolean;
  initialized: boolean;
  refreshInterval: number;
  teams: any[];
  matches: any[];
  rankings: any;
  last_sync: number;
  setEventId: (id: string) => void;
  initialSync: () => void;
  sync: () => void;
  stopSync: () => void;
  setScoringSoftwareUrl: (url: string) => void;
  setRefreshInterval: (interval: number) => void;
}

interface TournamentState {

}

class Tournament extends Component<TournamentProps, TournamentState> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.setEventId(this.props.match.params.id);
  }

  public render() {
    const { errors, loading, event } = this.props.data;
    let initButton;
    let secondButton;
    if (!this.props.initialized) {
      initButton = <Button color="blue" label="Initialize Data" onClick={() => { this.props.initialSync() }} />;
    } else {
      if (this.props.syncing) {
        secondButton = <Button color="red" label="Stop Sync" onClick={() => { this.props.stopSync() }} />
      } else {
        secondButton = <Button color="green" label="Begin Sync" onClick={() => { this.props.sync() }} />
      }
    }
    const teamColumns = [
      { key: 'id', label: 'ID' },
      { key: 'number', label: 'Number' },
      { key: 'name', label: 'Name' },
      { key: 'school', label: 'School' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' }
    ];
    /*const rankingsColumns = [
      { key: 'rank', label: 'Rank' },
      { key: 'team.id', label: 'Team ID' },
      { key: 'ranking_points', label: 'Ranking Points' },
      { key: 'qualifying_points', label: 'Qualifying Points' },
      { key: 'highest', label: 'Highest' },
      { key: 'matches', label: 'Matches' }
    ];*/
    /*const matchesColumns = [
      { key: 'rank', label: 'Rank' },
      { key: 'team.id', label: 'Team ID' },
      { key: 'ranking_points', label: 'Ranking Points' },
      { key: 'qualifying_points', label: 'Qualifying Points' },
      { key: 'highest', label: 'Highest' },
      { key: 'matches', label: 'Matches' }
    ];*/
    console.log(this.props.rankings);
    if (!loading) {
      return (
        <div className="Tournament">
          <h1>{event.name}</h1>
          <p>{event.id}</p>
          <Link to="/"><h3>{"< Back"}</h3></Link>
          <Input
            placeholder="Scoring Software URL"
            value={this.props.url}
            disabled={this.props.syncing}
            onChange={(value) => this.props.setScoringSoftwareUrl(value)}
          />
          {initButton}
          {secondButton}
          <p>Last Sync: {new Date(this.props.last_sync).toISOString()}</p>
          <JsonTable rows={this.props.teams} columns={teamColumns} />
        </div>
      );
    } else {
      return (
        <div>Loading Tournament Information...</div>
      );
    }
  }

}

const mapStateToProps = (state) => ({
  url: state.sync.scoring_software_url,
  syncing: state.sync.syncing,
  initialized: state.sync.initialized,
  refreshInterval: state.sync.refresh_interval,
  teams: state.sync.teams,
  matches: state.sync.matches,
  rankings: state.sync.rankings,
  last_sync: state.sync.last_sync
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEventId(id: string) {
      dispatch(setEventId(id));
    },
    initialSync() {
      dispatch(initialSync());
    },
    setScoringSoftwareUrl(url: string) {
      dispatch(setScoringSoftwareUrl(url));
    },
    setRefreshInterval(interval: number) {
      dispatch(setRefreshInterval(interval));
    },
    sync() {
      dispatch(sync());
    },
    stopSync() {
      dispatch(stopSync());
    }
  };  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(graphql<any, any>(gql`
  query Event($id: String!) {
    event(id: $id) {
      id
      shortid
      name
    }
  }
`,
{
options: (props: TournamentProps) => ({
  variables: {
    id: props.match.params.id
  }
})
})(Tournament));
