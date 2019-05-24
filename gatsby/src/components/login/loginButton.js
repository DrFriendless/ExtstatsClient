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

const lock = new Auth0Lock(
  'z7FL2jZnXI9C66WcmCMC7V1STnQbFuQl',
  'drfriendless.au.auth0.com',
  authOptions
);

function login() {
  lock.show();
}

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("identity");
  localStorage.removeItem("jwt");
  username = undefined;
  showAndHide();
}

function loadUserData(jwt) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(xhttp.responseText);
      console.log(response);
      username = response.username;
      localStorage.setItem("username", response.username);
      showAndHide();
    }
  };
  xhttp.open("GET", "https://api.drfriendless.com/v1/authenticate", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
  xhttp.send();
}

function setUserFromLocalStorage() {
  const identity = localStorage.getItem("identity");
  if (identity) {
    console.log("Found identity in local storage");
    const id = JSON.parse(identity);
    console.log(id);
    const seconds = (new Date()).getTime() / 1000;
    if (id.exp < seconds) {
      console.log("Login expired");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("identity");
      localStorage.removeItem("jwt");
      localStorage.removeItem("username");
      return;
    }
    localStorage.setItem("username", id["nickname"]);
  } else {
    console.log("No identity in local storage.");
  }
  const user = localStorage.getItem("username");
  if (user) {
    console.log("setting username to " + user);
    username = user;
  }
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
  localStorage.setItem('accessToken', authResult.accessToken);
  localStorage.setItem('identity', JSON.stringify(authResult.idTokenPayload));
  localStorage.setItem("jwt", authResult.idToken);
  loadUserData(authResult.idToken);
});

window.addEventListener("load", () => {
  document.getElementById("loginButton").onclick = () => login();
  document.getElementById("logoutButton").onclick = () => logout();
  setUserFromLocalStorage();
  showAndHide();
});
</script>
` }} />
      </div>
    );
  }
}

export default LoginButton;


