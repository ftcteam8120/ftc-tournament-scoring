import * as cheerio from 'cheerio';
import cheerioTableparser from 'cheerio-tableparser';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as bluebird from 'bluebird';
import * as _ from 'lodash';
import * as nw from 'nw';
import unescape from 'unescape';
import gql from 'graphql-tag';
bluebird.promisifyAll(prompt);

const TeamsMutation = gql`
  mutation TeamsMutation($event: String!, $teams: [SyncTeamInput]) {
    syncTeamsWithEvent(event: $event, teams: $teams) {
      id
      number
      name
      school
      city
      state
      country
    }
  }
`;

/*const MatchesMutation = gql`
  mutation MatchesMutation($event: String!, $matches: [SyncMatchInput]) {
    syncMatchesWithEvent(event: $event, matches: $matches) {
      id
      number
      red_alliance {
        teams {
          id
        }
      }
      blue_alliance {
        teams {
          id
        }
      }
    }
  }
`;*/

const RankingsMutation = gql`
  mutation RankingsMutation($event: String!, $rankings: [SyncRankingInput]) {
    syncRankingsWithEvent(event: $event, rankings: $rankings) {
      rankings {
        team {
          id
        }
        ranking_points
        qualifying_points
        highest
        rank
      }
    }
  }
`;

const MatchesMutation = gql`
  mutation MatchesMutation($event: String!, $matches: [SyncMatchInput]) {
    syncMatchesWithEvent(event: $event, matches: $matches) {
      id
      number
      winner
      type
      number
      sub
      red_alliance {
        total
        auto
        auto_b
        tele
        end
        penalty
      }
      blue_alliance {
        total
        auto
        auto_b
        tele
        end
        penalty
      }
    }
  }
`;
export default class Scoring {
  
  public client: ApolloClient<any>;

  public eventId: string;
  
  public serverUrl: string;

  public scoringSoftwareUrl: string;

  public refreshRate: number;

  private attempts: number = 0;

  constructor(client: ApolloClient<any>, eventId: string, url: string, refreshRate: number) {
    this.client = client;
    this.eventId = eventId;
    this.scoringSoftwareUrl = url;
    this.refreshRate = refreshRate;
  }

  private set(obj: any, field: string, value: any) {
    let val;
    if (value === '&#xA0;') {
      val = null;
    } else {
      // Remove random star at the end of number values
      if (value.indexOf('*') === value.length - 1)
        value = value.replace('*', '');  
      if (isNaN(value)) {
        val = value;
      } else {
        val = parseInt(value);
      }
    }
    _.set(obj, field, val);
  }

  private getTableData(body: string): any[][] {
    let $: any = cheerio.load(body);
    cheerioTableparser($);
    return $("table").parsetable();
  }

  private async fetchTableData(url: string): Promise<any[][]> {
    return fetch(url).then(res => res.text()).then(html => {
      return this.getTableData(html);
    });
  }

  private parseData(value: any) {
    switch (typeof value) {
      case 'string':
        return unescape(value.replace(/\s/, ''));
      default:
        return value;  
    }
  }

  private standardParse(data: any, fields: string[]): any[] {
    let result = [];
    for (var i = 0; i < data.length; i++) {
      for (var j = 1; j < data[i].length; j++) {
        let fieldName = fields[i];
        if (!result[j - 1]) {
          result[j - 1] = {};
        }
        if (data[i][j] != '&#xA0;' && fieldName) {
          this.set(result[j - 1], fieldName, this.parseData(data[i][j]));
        }
      }
    }
    return result;
  }

  public async loadTeams(): Promise<any[]> {
    return this.fetchTableData(this.scoringSoftwareUrl + 'TeamList').then(data => {
      return this.standardParse(data, [
        'number',
        'name',
        'school',
        'city',
        'state',
        'country'
      ]);
    });
  }
  
  /*public async loadMatches() {
    return fetch(this.scoringSoftwareUrl + 'MatchList').then(res => res.text()).then(body => {
      let data = this.getTableData(body);
      let matches = [];
      for (var i = 0; i < data.length; i++) {
        for (var j = 1; j < data[i].length; j++) {
          let fieldName;
          switch (i) {
            case 0: {
              fieldName = 'number';
              break;
            }
            case 1: {
              fieldName = 'red_alliance.teams.0';
              break;
            }
            case 2: {
              fieldName = 'red_alliance.teams.1';
              break;
            }
            case 3: {
              fieldName = 'blue_alliance.teams.0';
              break;
            }
            case 4: {
              fieldName = 'blue_alliance.teams.1';
              break;
            }
          }
          if (!matches[j - 1]) {
            matches[j - 1] = {};
          }
          if (!matches[j - 1].red_alliance) {
            matches[j - 1].red_alliance = {};
          }
          if (!matches[j - 1].blue_alliance) {
            matches[j - 1].blue_alliance = {};
          }
          if (!matches[j - 1].red_alliance.teams) {
            matches[j - 1].red_alliance.teams = [];
          }
          if (!matches[j - 1].blue_alliance.teams) {
            matches[j - 1].blue_alliance.teams = [];
          }
          this.set(matches[j - 1], fieldName, data[i][j]);
        }
      }
      return matches;
    });
  }*/
  
  public async loadMatches() {
    return fetch(this.scoringSoftwareUrl + 'MatchDetails').then(res => res.text()).then(body => {
      let data = this.getTableData(body);
      let matches = [];
      for (var i = 0; i < data.length; i++) {
        for (var j = 2; j < data[i].length; j++) {
          let fieldName;
          switch (i) {
            case 0: {
              fieldName = 'number';
              break;
            }
            case 1: {
              fieldName = 'winner';
              break;
            }
            case 2: {
              fieldName = 'red_teams';
              break;
            }
            case 3: {
              fieldName = 'blue_teams';
              break;
            }
            case 4: {
              fieldName = 'red_alliance.total';
              break;
            }
            case 5: {
              fieldName = 'red_alliance.auto';
              break;
            }
            case 6: {
              fieldName = 'red_alliance.auto_b';
              break;
            }
            case 7: {
              fieldName = 'red_alliance.tele';
              break;
            }
            case 8: {
              fieldName = 'red_alliance.end';
              break;
            }
            case 9: {
              fieldName = 'red_alliance.penalty';
              break;
            }
            case 10: {
              fieldName = 'blue_alliance.total';
              break;
            }
            case 11: {
              fieldName = 'blue_alliance.auto';
              break;
            }
            case 12: {
              fieldName = 'blue_alliance.auto_b';
              break;
            }
            case 13: {
              fieldName = 'blue_alliance.tele';
              break;
            }
            case 14: {
              fieldName = 'blue_alliance.end';
              break;
            }
            case 15: {
              fieldName = 'blue_alliance.penalty';
              break;
            }
          }
          if (data[i][j] != '&#xA0;' && fieldName) {
            if (!matches[j - 2]) {
              matches[j - 2] = {};
            }
            if (!matches[j - 2].red_alliance) {
              matches[j - 2].red_alliance = {};
            }
            if (!matches[j - 2].blue_alliance) {
              matches[j - 2].blue_alliance = {};
            }
            if (!matches[j - 2].red_alliance.teams) {
              matches[j - 2].red_alliance.teams = [];
            }
            if (!matches[j - 2].blue_alliance.teams) {
              matches[j - 2].blue_alliance.teams = [];
            }
            if (fieldName === 'number') {
              let values = data[i][j].split('-');
              this.set(matches[j - 2], 'number', values[1]);
              let type;
              switch (values[0]) {
                case 'F': {
                  type = 'FINAL';
                  break;
                }
                case 'Q': {
                  type = 'QUALIFYING';
                  break;
                }
                case 'SF': {
                  type = 'SEMIFINAL';
                  break;
                }
              }
              this.set(matches[j - 2], 'type', type);
              if (values[2]) {
                this.set(matches[j - 2], 'sub', values[2]);
              }
            } else if (fieldName === 'winner') {
              let winner;
              switch (data[i][j].split(' ')[1]) {
                case 'R':
                  winner = 'RED';
                  break;
                case 'B':
                  winner = 'BLUE';
                  break;
                default:
                  winner = 'TIE';
                  break;
              }
              this.set(matches[j - 2], fieldName, winner);
            } else if (fieldName === 'red_teams') {
              let teams = data[i][j].split(' ');
              if (teams[0]) this.set(matches[j - 2], 'red_alliance.teams.0', teams[0]);
              if (teams[1]) this.set(matches[j - 2], 'red_alliance.teams.1', teams[1]);
            } else if (fieldName === 'blue_teams') {
              let teams = data[i][j].split(' ');
              if (teams[0]) this.set(matches[j - 2], 'blue_alliance.teams.0', teams[0]);
              if (teams[1]) this.set(matches[j - 2], 'blue_alliance.teams.1', teams[1]);
            } else {
              this.set(matches[j - 2], fieldName, data[i][j]);
            }
          }
        }
      }
      return matches;
    });
  }
  
  public async loadRankings() {
    return fetch(this.scoringSoftwareUrl + 'Rankings').then(res => res.text()).then(body => {
      let data = this.getTableData(body);
      return this.standardParse(data, [
        'rank',
        'team',
        null,
        'qualifying_points',
        'ranking_points',
        'highest',
        'matches'
      ]);
    });
  }

  public async refresh() {
    let promises = [];
    promises.push(this.loadRankings().then(result => {
      return this.client.mutate({
        mutation: RankingsMutation,
        variables: {
          event: this.eventId,
          rankings: result
        }
      });
    }));
    promises.push(this.loadMatches().then(result => {
      return this.client.mutate({
        mutation: MatchesMutation,
        variables: {
          event: this.eventId,
          matches: result
        }
      });
    }));
    return Promise.all(promises).then((results) => {
      console.log('Syncronized data');
      return {
        rankings: results[0].data.syncRankingsWithEvent.rankings,
        matches: results[1].data.syncMatchesWithEvent
      };
      /*if (cont)
        setTimeout(() => this.refresh(true), this.refreshRate);*/
    }).catch(error => {
      console.error(error);
      /*console.log('Request(s) failed, retrying');
      if (this.attempts < 10 && cont) {
        setTimeout(() => this.refresh(true), this.refreshRate);
        this.attempts++;
      } else {
        console.log('Max reconnection attempts reached, shutting down :(');
        process.exit(1);
      }*/
    });
  }

  public async load() {
    let promises = [];
    promises.push(this.loadTeams().then(result => {
      return this.client.mutate({
        mutation: TeamsMutation,
        variables: {
          event: this.eventId,
          teams: result
        }
      });
    }));
    promises.push(this.loadMatches().then(result => {
      return this.client.mutate({
        mutation: MatchesMutation,
        variables: {
          event: this.eventId,
          matches: result
        }
      });
    }));
    return Promise.all(promises).then((results) => {
      console.log('Teams and Matches Syncronized');
      return {
        teams: results[0].data.syncTeamsWithEvent,
        matches: results[1].data.syncMatchesWithEvent
      };
    });
  }    

}