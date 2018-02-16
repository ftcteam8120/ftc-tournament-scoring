import { Node } from './Node';
import { User } from './User';
import { Location, Event } from './Event';
import { Match } from './Match';

export class TeamColors {
  primary: string;
  secondary: string;
}

export class Team extends Node {
  coaches?: User[];
  members?: User[];
  twitter?: string;
  biography?: string;
  name?: string;
  number?: number;
  affiliation?: string;
  location?: Location;
  city?: string;
  state?: string;
  country?: string;
  photo_url?: string;
  website?: string;
  year?: number;
  colors?: TeamColors;
  banner_url?: string;
  matches?: Match[];
  events?: Event[];
}