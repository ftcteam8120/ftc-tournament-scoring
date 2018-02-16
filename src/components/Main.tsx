import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, FormControl, Select, MenuItem, InputLabel } from 'material-ui';
import { connect } from 'react-redux';
import { graphql, ChildProps } from 'react-apollo';
import gql from 'graphql-tag';
import { RootState } from '../core';
import { logout, sync, stopSync, setEventId, setScoringSoftwareUrl } from '../core/actions';

import { User } from '../core/types';

const styles = {
  input: {
    width: 'calc(100% - 32px)'
  },
  button: {
    marginTop: 16
  }
};

interface Props {
  user: User;
  syncing: boolean;
  eventId: string;
  scoringSoftwareUrl: string;
  logout: () => void;
  sync: () => void;
  stopSync: () => void;
  setEventId: (id: string) => void;
  setScoringSoftwareUrl: (url: string) => void;
}

interface Response {
  user: User;
}

class Main extends Component<ChildProps<Props, Response>> {
  render() {
    let { error, loading, user } = this.props.data;
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="title" color="inherit">FTC Tournament Sync</Typography>
            <span style={{ marginLeft: 'auto' }}/>
            <Button color="inherit" onClick={() => this.props.logout()}>Logout</Button>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: 72, marginLeft: 16, marginRight: 16, display: 'block' }}>
          <TextField
            label="Scoring Software URL"
            value={this.props.scoringSoftwareUrl}
            onChange={(e) => this.props.setScoringSoftwareUrl(e.target.value)}
            helperText="The URL for the scoring software server"
            margin="normal"
            style={styles.input}
          />  
          {/*<TextField
            label="Tournament Key"
            value={this.props.eventKey}
            onChange={(e) => this.props.setEventKey(e.target.value)}
            helperText="The tournament key can be obtained from the tournament admin console"
            margin="normal"
            style={styles.input}
          />*/}
          {!loading && (
            <FormControl style={styles.input}>
              <InputLabel htmlFor="event-id">Event ID</InputLabel>
              <Select
                value={this.props.eventId}
                onChange={(e) => this.props.setEventId(e.target.value)}
                inputProps={{
                  name: 'eventId',
                  id: 'event-id',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {user.events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>{event.code} - {event.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {this.props.syncing ? (
            <Button variant="raised" color="secondary" style={styles.button} onClick={() => this.props.stopSync()}>
              Stop Sync
            </Button>
          ) : (
            <Button variant="raised" color="primary" style={styles.button} onClick={() => this.props.sync()}>
              Start Sync
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  syncing: state.sync.syncing,
  eventId: state.sync.event_id,
  scoringSoftwareUrl: state.sync.scoring_software_url
});

// Function to map the dispatch functions to the component props
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    },
    sync: () => {
      dispatch(sync());
    },
    stopSync: () => {
      dispatch(stopSync());
    },
    setEventId: (id: string) => {
      dispatch(setEventId(id));
    },
    setScoringSoftwareUrl: (url: string) => {
      dispatch(setScoringSoftwareUrl(url));
    }
  };  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(graphql<Response, Props>(gql`
  query TeamQuery($id: String!) {
    user(id: $id) {
      id
      events {
        id
        code
        name
      }
    }
  }
`, {
    options: (props: Props) => {
      return {
        variables: {
          id: props.user.id
        }
      }
    }
})(Main));