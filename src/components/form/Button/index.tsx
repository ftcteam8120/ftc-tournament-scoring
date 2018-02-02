import React, { Component } from 'react';

import './index.less';

interface ButtonProps {
  name?: string;
  label: string;
  color?: "red" | "green" | "blue" | "gray" | "twitter-blue" | "google-red"
  onClick: (event: any) => void;
  style?: any;
  className?: string;
}

interface ButtonState {}

export class Button extends Component<ButtonProps, ButtonState> {

  public render() {
    let classes: string = "";
    if (this.props.color) {
      classes += " " + this.props.color + "-button";
    }
    if (this.props.className) {
      classes += " " + this.props.className;
    }
    return (
      <div className="form-group">
        <button
          className={"form-button" + classes}
          style={this.props.style}
          name={this.props.name}
          onClick={(e) => this.props.onClick(e)}
        >{this.props.label}</button>
      </div>
    );
  }

}
