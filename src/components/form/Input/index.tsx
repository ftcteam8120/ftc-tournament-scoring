import React, { Component } from 'react';

import './index.less';

interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  disabled?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  style?: any;
  className?: string;
}

interface InputState {}

export class Input extends Component<InputProps, InputState> {

  public render() {
    let label;
    if (this.props.label) {
      label = <label className="form-label">{this.props.label}</label>;
    }
    return (
      <div className="form-group">
        {label}
        <input
          className={"form-input " + this.props.className}
          style={this.props.style}
          name={this.props.name}
          type={this.props.type}
          value={this.props.value}
          disabled={this.props.disabled}
          onChange={(e) => { this.props.onChange(e.target.value) }}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }

}
