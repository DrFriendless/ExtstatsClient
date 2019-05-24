import React, { Component } from 'react';
import './loginButton.css';

class LoginButton extends Component {

  render() {
    return (
      <div className="extstats-login-logout">
        <div className="extstats-logout">
          <button className="btn btn-primary btn-margin" id="logoutButton">
            Log Out
          </button>
          <span><a href="/user.html" id="usernamelink"></a></span> : undefined}
        </div>
        <div className="extstats-login">
          <button className="btn btn-primary btn-margin" id="loginButton">
            Log In
          </button>
        </div>
      </div>
    );
  }
}

export default LoginButton;




