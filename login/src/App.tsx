import React, { Component } from 'react';
import './App.css';
import Auth0LockStatic from 'auth0-lock';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type AuthResponse = { username: string };

class ExtstatsLogin extends Component {
    private username: string | undefined = undefined;

    private lock: Auth0LockStatic | undefined;

    componentDidMount(): void {
        this.setUserFromLocalStorage();
        const authOptions: Auth0LockConstructorOptions = {
            auth: {
                responseType: 'token id_token',
                scope: 'openid',
                redirect: false
            } as Auth0LockAuthOptions,
            autoclose: true,
            oidcConformant: true,
            popupOptions: { width: 300, height: 400, left: 300, top: 200 },
            usernameStyle: 'username'
        };

        this.lock = new Auth0LockStatic(
            'z7FL2jZnXI9C66WcmCMC7V1STnQbFuQl',
            'drfriendless.au.auth0.com',
            authOptions
        );
        this.lock.on('authenticated', authResult => {
            console.log('authenticated');
            console.log(authResult);
            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('identity', JSON.stringify(authResult.idTokenPayload));
            localStorage.setItem('jwt', authResult.idToken);
            this.loadUserData(authResult.idToken);
        });
    }

    private setUserFromLocalStorage() {
        const identity = localStorage.getItem('identity');
        if (identity) {
            console.log('Found identity in local storage');
            const id = JSON.parse(identity);
            console.log(id);
            const seconds = (new Date()).getTime() / 1000;
            if (id.exp < seconds) {
                console.log('Login expired');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('identity');
                localStorage.removeItem('jwt');
                localStorage.removeItem('username');
                return;
            }
            localStorage.setItem('username', id['nickname']);
        } else {
            console.log('No identity in local storage.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('jwt');
            localStorage.removeItem('username');
        }
        const user = localStorage.getItem('username');
        if (user) {
            console.log('setting username to ' + user);
            this.username = user;
        }
    }

    private loadUserData(jwt: string) {
        console.log('loadUserData');
        const headers = { 'Authorization': 'Bearer ' + jwt };
        const config: AxiosRequestConfig = { headers };
        axios.get('https://api.drfriendless.com/v1/authenticate', config)
            .then((response: AxiosResponse)  => {
                const resp = response.data as AuthResponse;
                this.username = resp.username;
                localStorage.setItem('username', resp.username);
            });
    }


    private login() {
        if (this.lock) this.lock.show();
    }

    private logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('identity');
        localStorage.removeItem('jwt');
        this.username = undefined;
    }

    render() {
        console.log('render ' + this.username);
        return (
            <div className="extstats-login-logout">
                { this.username ?
                    <div className="extstats-logout">
                        <button className="btn btn-primary btn-margin" onClick={e => this.logout()}>
                            Log Out
                        </button>
                        <span><a href="/user.html">{this.username}</a></span> : undefined}
                    </div>
                    :
                    <div className="extstats-login">
                        <button className="btn btn-primary btn-margin" onClick={e => this.login()}>
                            Log In
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default ExtstatsLogin;
