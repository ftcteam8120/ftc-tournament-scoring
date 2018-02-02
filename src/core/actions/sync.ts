export const INITIAL_SYNC = 'INITIAL_SYNC';
export const INITIAL_SYNC_SUCCESS = 'INITIAL_SYNC_SUCCESS';
export const INITIAL_SYNC_ERROR = 'INITIAL_SYNC_ERROR';
export const SYNC_DATA = 'SYNC_DATA';
export const SYNC_DATA_SUCCESS = 'SYNC_DATA_SUCCESS';
export const SYNC_DATA_ERROR = 'SYNC_DATA_ERROR';
export const SET_REFRESH_INTERVAL = 'SET_REFRESH_INTERVAL';
export const SET_SCORING_SOFTWARE_URL = 'SET_SCORING_SOFTWARE_URL';
export const SET_EVENT_ID = 'SET_EVENT_ID';
export const STOP_SYNC = 'STOP_SYNC';

import Scoring from '../../scoring';

import { store, client } from '../../index';

export function initialSync(): any {
  let scoring = new Scoring(
    client,
    store.getState().sync.event_id,
    store.getState().sync.scoring_software_url,
    store.getState().sync.refresh_interval
  );
  return function (dispatch) {
    dispatch({ type: INITIAL_SYNC });
    scoring.load().then((value: any) => {
      dispatch({
        type: INITIAL_SYNC_SUCCESS,
        teams: value.teams,
        matches: value.matches
      });
    }).catch((error) => {
      console.error(error);
      dispatch({
        type: INITIAL_SYNC_ERROR,
        error: error
      });
    })
  }
}

export function sync(): any {
  let scoring = new Scoring(
    client,
    store.getState().sync.event_id,
    store.getState().sync.scoring_software_url,
    store.getState().sync.refresh_interval
  );
  return function (dispatch) {
    dispatch({ type: SYNC_DATA });
    scoring.refresh().then((result: any) => {
      dispatch({
        type: SYNC_DATA_SUCCESS,
        rankings: result.rankings,
        matches: result.matches
      });
      if (store.getState().sync.syncing) {
        setTimeout(() => {
          store.dispatch(sync())
        }, store.getState().sync.refresh_interval);
      }
    }).catch((error) => {
      console.error(error);
      if (store.getState().sync.retries < 10 && store.getState().sync.syncing) {
        dispatch({
          type: SYNC_DATA_ERROR,
          error
        });
        dispatch(sync());
      } else {
        console.log('Error: server timeout');
      }
    });
  }
}

export function stopSync() {
  return {
    type: STOP_SYNC
  };
}

export function setEventId(id: string) {
  return {
    type: SET_EVENT_ID,
    id
  };
}

export function setScoringSoftwareUrl(url: string) {
  return {
    type: SET_SCORING_SOFTWARE_URL,
    url
  };
}

export function setRefreshInterval(interval: number) {
  return {
    type: SET_SCORING_SOFTWARE_URL,
    interval
  };
}