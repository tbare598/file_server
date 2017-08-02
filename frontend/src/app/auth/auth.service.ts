import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { myConfig } from './auth.config';
import { UserProfileModel } from './user-profile.model';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
  lock = new Auth0Lock(myConfig.clientID, myConfig.domain, {
    auth: {
      params: {
        scope: 'openid profile permissions roles groups',
        client_id: 'fgh97AHeJSwz0TkvTR4fQdAF2F3eu2oQ',
        nonce: this.randomString(20),
        state: '1' // TODO: GIVE A STATE
      },
      responseType: 'id_token token',
      redirect_uri: 'http://localhost:3000', // TODO:SET IN CONFIG
    }
  });
  private _userProfile$: BehaviorSubject<UserProfileModel>
  private _accessToken: string;
  private _idToken: string;

  get userProfile(): UserProfileModel {
    return this._userProfile$.getValue();
  }

  set userProfile(newUser: UserProfileModel) {
    this._userProfile$.next(newUser);
  }

  get userProfile$(): Observable<UserProfileModel> {
    return this._userProfile$.asObservable();
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  constructor() {
    this._userProfile$ = new BehaviorSubject<UserProfileModel>(new UserProfileModel);

    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('access_token', authResult.accessToken);
      this._accessToken = authResult.accessToken;
      this._idToken = authResult.idToken;
      // Fetch profile information
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle error
          console.log('ERRORRRRRRR!!!!!');
          console.log(error);
          return;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
      });
    });
    this._accessToken = localStorage.getItem('access_token');
    this._idToken = localStorage.getItem('id_token');
    if (this._accessToken) {
      // Fetch profile information
      this.lock.getUserInfo(this._accessToken, (error, profile) => {
        if (error) {
          // Handle error
          console.log('ERRORRRRRRR!!!!!');
          console.log(error);
          return;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
      });
    }
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired('id_token');
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
  }

  randomString (length): string {
    const bytes = new Uint8Array(length);
    const random = window.crypto.getRandomValues(bytes);
    const result = [];
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    for (let i = 0; i < random.byteLength; i++) {
        result.push(charset[random[i] % charset.length]);
    }
    return result.join('');
  }
}
