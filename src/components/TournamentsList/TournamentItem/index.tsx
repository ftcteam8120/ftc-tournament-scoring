import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './index.less';

interface TournamentItemProps {
  id: string;
  name: string;
}

export default class TournamentItem extends Component<TournamentItemProps> {
  render() {
    return (
      <div className="tournament-item">
        <h2><Link to={"/event/"+ this.props.id}>{this.props.name}</Link></h2>
        <p>{this.props.id}</p>
      </div>
    );
  }
}