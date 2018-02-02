import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators, Action } from 'redux';
import { login, logout, AuthError } from '../../core/actions/auth';

import './index.less';

import { Input, Button } from '../form';

interface LoginProps {
  authenticated: boolean;
  authError: AuthError;
  login: (username: string, password: string) => Action;
  logout: () => Action;
}

interface LoginState {
  username: string;
  password: string;
}

class Login extends Component<LoginProps, LoginState> {

  private backgroundImage: string;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  private getAuthError(code: AuthError): string {
    switch (code) {
      case AuthError.INCORRECT_PASSWORD:
        return 'Incorrect password';
      case AuthError.NOT_FOUND:
        return 'User not found'
    }
  }

  // Generate a random background image
  private getRandomImage(): string {
    let index: number = Math.floor(Math.random() * 5 + 1);
    // First return a gradient to tint the image, then return the image
    return ("linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('/img/background/bg" + index + ".jpg')");
  }

  componentWillMount() {
    this.backgroundImage = this.getRandomImage();
  }

  private updateValue(target: string, value: any): void {
    this.setState({
      [target]: value
    } as any);
  }

  public render() {
    // Check if the user is authenticated
    if (this.props.authenticated) {
      // Redirect home if they are
      return <Redirect to="/"/>
    } else {
      return (
        <div className="login" style={{ backgroundImage: this.backgroundImage }}>
          <div className="login-container">
            <div className="logo-container">
              <div className="logo-container-inner">
                <img src="/img/logo_white.svg" />
                <h3>FTC Tournament Login</h3>
              </div>
            </div>
            <form className="login-form" onSubmit={() => { this.props.login(this.state.username, this.state.password) }}>  
              <div className="login-section">
                <div className="login-section-title">
                  <h5>{
                    this.props.authError ?
                      <div className="authError">{this.getAuthError(this.props.authError)}</div> :
                      'Username & Password'
                  }</h5>
                </div>
                <Input
                  value={this.state.username}
                  onChange={(v) => this.updateValue("username", v)}
                  placeholder="Username"
                  className="login-form-element"
                />
                <Input
                  value={this.state.password}
                  type="password"
                  onChange={(v) => this.updateValue("password", v)}
                  placeholder="Password"
                  className="login-form-element"
                />
                <Button
                  onClick={() => { this.props.login(this.state.username, this.state.password) }}
                  label="Login"
                  color="blue"
                  className="login-form-element"
                />
              </div>
              <div className="login-section">
                <div className="login-section-title">
                  <h5>Social Media</h5>
                </div>
                <Button
                  onClick={() => {  }}
                  label="Login with Twitter"
                  color="twitter-blue"
                  className="login-form-element"
                />
                <Button
                  onClick={() => {  }}
                  label="Login with Google"
                  color="google-red"
                  className="login-form-element"
                />
              </div>
            </form>
          </div>
        </div>
      );
    }
  }

}

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
  authError: state.auth.authError
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username: string, password: string) => {
      dispatch(login(username, password));
    },
    logout: () => {
      dispatch(logout());
    }
  };  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
