import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Client } from '../models/client';

@Injectable()
export class UserServices {
  public url: string;
  public identity;
  public token;
  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(client): Observable<any> {
    const json = JSON.stringify(client);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'register', params, {headers: headers});
  }

  sendResetPasswordLink(data: any): Observable<any>{
    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'sendPasswordLink', params, {headers: headers});
  }

  changePassword(data: any): Observable<any>{
    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'changePassword', params, {headers: headers});
  }

  editClientInfo(token, idClient, client: any): Observable<any> {
    const json = JSON.stringify(client);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    console.log(headers);
    return this._http.put(this.url + 'editClientInfo/' + idClient, params, {headers: headers});
  }

  getClientInfo(idClient: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getClientInfo/' + idClient, {headers: headers});
  }

  getClientPhoto(idClient: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getClientPhoto/' + idClient, {headers: headers});
  }

  likeProduct(like): Observable<any> {
    const json = JSON.stringify(like);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'like', params, {headers: headers});
  }

  detachFavorite(like): Observable<any> {
    const json = JSON.stringify(like);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'detachLike', params, {headers: headers});
  }

  showFavorite(idClient, idProduct): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getFavorite/' + idClient + '/' + idProduct, {headers: headers});
  }

  showFavoriteList(idClient): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getFavoriteList/' + idClient, {headers: headers});
  }

  signup(client, getToken = null): Observable<any> {
    if (getToken != null) {
      client.getToken = 'true';
    }
    const json    = JSON.stringify(client);
    const params  = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'login', params, {headers: headers});
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));
    if (identity !== 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }
}


