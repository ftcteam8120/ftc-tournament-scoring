import { Node } from './Node';
import { Team } from './Team';
import { Event } from './Event';

export enum MatchType {
  FINAL = 'FINAL',
  SEMIFINAL = 'SEMIFINAL',
  QUALIFYING = 'QUALIFYING'
}

export enum Winner {
  RED = 'RED',
  BLUE = 'BLUE',
  TIE = 'TIE'
}

export class Alliance {
  total?: number;
  auto?: number;
  auto_b?: number;
  tele?: number;
  end?: number;
  penalty?: number;
  teams?: Team[];
  surrogates?: Team[];
}

export class Match extends Node {
  event?: Event;
  winner?: Winner;
  type?: MatchType;
  number?: number;
  sub?: number;
  winning_alliance?: Alliance;
  red_alliance?: Alliance;
  blue_alliance?: Alliance;
}