import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Action } from 'redux';
import { RootState } from '../core';
import { AuthError, login, logout } from '../core/actions/auth';
import { Paper, Button, TextField, Typography, AppBar, Toolbar, IconButton } from 'material-ui';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText, } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

const styles = {
  formControl: {
    width: 'calc(100% - 32px)',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16
  },
  button: {
    marginLeft: 32,
    marginRight: 32,
    marginTop: 32,
    width: 'calc(100% - 64px)'
  }
};

interface LoginProps {
  authenticated: boolean;
  authError: AuthError;
  login: (username: string, password: string) => Action;
  logout: () => Action;
}

interface LoginState {
  username: string;
  password: string;
  showPassword: boolean;
}

class Login extends Component<LoginProps, LoginState> {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false
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

  updateValue(target: string, value: any): void {
    this.setState({
      [target]: value
    } as any);
  }

  login(e) {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  public render() {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        <Paper style={{ marginTop: 64, marginLeft: 'auto', marginRight: 'auto', maxWidth: 300, height: 400, position: 'relative' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 16 }}>
              <Typography variant="display1" color="inherit" style={{ textAlign: 'center' }}>
                Sync Software Login
              </Typography>
              <form style={{ width: '100%' }} onSubmit={(e) => this.login(e)}>
                <FormControl aria-describedby="username-error-text" style={styles.formControl}>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input id="username" value={this.state.username} onChange={(e) => this.updateValue('username', e.target.value)} />
                </FormControl>
                <FormControl style={styles.formControl}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="adornment-password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    onChange={(e) => this.updateValue('password', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => { this.setState({ showPassword: !this.state.showPassword }) }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Button variant="raised" color="primary" type="submit" style={styles.button}>
                  Login
                </Button>
              </form>
            </div>
          </div>
          <Typography style={{ textAlign: 'center', width: '100%', position: 'absolute', bottom: 16 }} variant="caption">Created by FTC Team 8120, The Electric Hornets</Typography>
        </Paper>
      </div>
    );
  }

}

const mapStateToProps = (state: RootState) => ({
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
