import React, { Component } from 'react';
import './loginButton.css';

class LoginButton extends Component {

  render() {
    return (
      <div className="extstats-login-logout">
        <div className="extstats-logout" id="logoutBlock">
          <button className="btn btn-primary btn-margin" id="logoutButton">
            Log Out
          </button>
          <span><a href="/user.html" id="usernamelink"></a></span>
        </div>
        <div className="extstats-login">
          <button className="btn btn-primary btn-margin" id="loginButton">
            Log In
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: `
<script src="https://cdn.auth0.com/js/lock/11.8.1/lock.min.js" type="text/javascript"></script>
<script type="text/javascript">
let username;

const authOptions = {
  auth: {
    responseType: 'token id_token',
    scope: 'openid',
    redirect: false
  },
  autoclose: true,
  oidcConformant: true,
  popupOptions: { width: 300, height: 400 },
  usernameStyle: 'username'
};

const clientId = 'z7FL2jZnXI9C66WcmCMC7V1STnQbFuQl';

const lock = new Auth0Lock(
  clientId,
  'drfriendless.au.auth0.com',
  authOptions
);

function login() {
  lock.show();
}

function logout() {
  document.cookie = 'extstatsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  username = undefined;
  localStorage.setItem("username", username);
  showAndHide();
}

function loadUserData(jwt) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
      const response = JSON.parse(xhttp.responseText);
      if (response.userName) {
        username = response.userName;
        localStorage.setItem("username", response.userName);
        showAndHide();
      }
    }
  };
  xhttp.withCredentials = true;
  xhttp.open("GET", "https://api.drfriendless.com/v1/authenticate", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
  xhttp.send();
}

function checkForLogin() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
      const response = JSON.parse(xhttp.responseText);
      if (response.userName) {
        username = response.userName;
      } else {
        username = undefined;
      }
      localStorage.setItem("username", username);
      showAndHide();
    }
  };
  xhttp.withCredentials = true;
  xhttp.open("GET", "https://api.drfriendless.com/v1/login", true);
  xhttp.send();
}

function showAndHide() {
  console.log("showAndHide");
  console.log(!!username);
  const loginButton = document.getElementById("loginButton");
  const logoutBlock = document.getElementById("logoutBlock");
  const logoutButton = document.getElementById("logoutButton");
  const userLink = document.getElementById("usernamelink");
  if (username) {
    if (loginButton) loginButton.style.display = "none";
    if (logoutBlock) {
      logoutBlock.style.display = "block";
      logoutButton.style.display = "block";
    }
  } else {
    if (loginButton) loginButton.style.display = "block";
    if (logoutBlock) logoutBlock.style.display = "none";
  }
  if (userLink) userLink.innerHTML = username || "";
}

lock.on("authenticated", authResult => {
  console.log("authenticated");
  console.log(authResult);
  const seconds = (new Date()).getTime() / 1000;
  if (authResult.idTokenPayload.exp > seconds &&
      authResult.idTokenPayload.iss === "https://drfriendless.au.auth0.com/" &&
      authResult.idTokenPayload.aud === clientId) {
      loadUserData(authResult.idToken);
  }
});

window.addEventListener("load", () => {
  document.getElementById("loginButton").onclick = () => login();
  document.getElementById("logoutButton").onclick = () => logout();
  checkForLogin();
});
</script>
` }} />
      </div>
    );
  }
}

export default LoginButton;


