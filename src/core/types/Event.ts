import { Node } from './Node';
import { Team } from './Team';
import { User } from './User';
import { Match } from './Match';

export enum EventType {
  SCRIMMAGE = 'SCRIMMAGE',
  MEET = 'MEET',
  QUALIFYING = 'QUALIFYING',
  SUPER_QUALIFYING = 'SUPER_QUALIFYING',
  CHAMPIONSHIP = 'CHAMPIONSHIP',
  SUPER_REGIONAL = 'SUPER_REGIONAL',
  WORLD  = 'WORLD'
}

export enum SponsorType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY'
}

export class Sponsor {
  name?: string;
  logo_url?: string;
  type?: SponsorType;
}

export class Coordinates {
  lat?: number;
  lng?: number;
}

export class Location {
  address?: string;
  description?: string;
  place_id?: string;
  coordinates?: Coordinates;
}

export class Ranking {
  team?: Team;
  ranking_points?: number;
  qualifying_points?: number;
  highest?: number;
  rank?: number;
}

export class Event extends Node {
  type?: EventType;
  code?: string;
  admins?: User[];
  teams?: Team[];
  current_round?: number;
  name?: string;
  location?: Location;
  description?: string;
  start?: Date;
  end?: Date;
  sponsors?: Sponsor[];
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  rankings?: Ranking[];
  matches?: Match[];
}