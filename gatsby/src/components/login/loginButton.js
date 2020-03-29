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
          <div className="userLink"><a href="/user.html" id="usernamelink"></a></div>
          <div id="geekLinkBlock">
          </div>
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
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhttp.responseText);
      console.log(response);
      setUserName(response);
      setGeekLinks(response);
    } else {
      setUserName(undefined);
      setGeekLinks(undefined);
    }
  };
  xhttp.withCredentials = true;
  xhttp.open("GET", "https://api.drfriendless.com/v1/authenticate", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
  xhttp.send();
}

function setUserName(response) {
  if (response && response.userName) {
    username = response.userName;
  } else {
    username = undefined;
  }
  localStorage.setItem("username", username);
  showAndHide();
}

function setGeekLinks(response) {
  const geekLinkBlock = document.getElementById("geekLinkBlock");
  if (geekLinkBlock) geekLinkBlock.innerHTML = "";
  if (response && response.config && response.config.usernames && geekLinkBlock) {
    response.config.usernames.forEach(function(u) {
      const div = document.createElement("div");
      div.setAttribute('class', 'geekLink');
      div.innerHTML = '<a href="/geek.html?geek=' + u + '">' + u + '</a>';
      geekLinkBlock.appendChild(div);
    });
  }
}

function checkForLogin() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhttp.responseText);
      console.log(response);
      setUserName(response);
      setGeekLinks(response);
    } else if (this.readyState === 4) {
      setUserName(undefined);
      setGeekLinks(undefined);
    }
  };
  xhttp.withCredentials = true;
  xhttp.open("GET", "https://api.drfriendless.com/v1/login", true);
  xhttp.send();
}

function showAndHide() {
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


